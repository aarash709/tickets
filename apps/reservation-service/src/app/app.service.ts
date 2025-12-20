import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedlockService } from 'nestjs-redlock-universal';
import { LockHandle } from 'redlock-universal';
import { v7 as uuid7 } from 'uuid';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private database: DatabaseService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private redlock: RedlockService,
  ) {}

  private reservation = new Map<
    string,
    {
      lock: LockHandle;
      seatId: string;
      userId: number;
      ttl: number;
    }
  >();

  async reserve(data: { seatId: string; userId: number }) {
    const lockKey = `seatLock:${data.seatId}`;
    const ttl = 60 * 2 * 1000;
    const reservationId = uuid7();

    let lock: LockHandle;

    try {
      lock = await this.redlock.acquire(lockKey);
      Logger.log(`lock:${lock.acquiredAt}`);
    } catch (error) {
      throw new RpcException({
        statusCode: 409,
        message: `Seat is beign processed${error}`,
      });
    }

    try {
      const seatResult = await this.database.$transaction(async (tx) => {
        const seat = await tx.seat.findUnique({
          where: { seatId: data.seatId, status: 'AVAILABLE' },
        });

        if (!seat)
          throw new RpcException({
            statusCode: 410,
            message: 'Seat is no longer available',
          });

        const reservedSeat = await tx.seat.update({
          where: { seatId: seat?.seatId },
          data: { status: 'RESERVED' },
        });
        Logger.log('seat is reserved and waiting for payment');
        return reservedSeat;
      });

      this.reservation.set(reservationId, {
        lock: lock,
        seatId: data.seatId,
        userId: data.userId,
        ttl: ttl,
      });

      return {
        seatId: seatResult.seatId,
        status: seatResult.status,
        reservationId: reservationId,
        lockExpiresIn: new Date(Date.now() + ttl),
      };
    } catch (error) {
      await this.redlock.release(lockKey, lock);
      throw new RpcException({
        statusCode: 500,
        message: `reservation failed!'${error}`,
      });
    }
  }

  async handlePaymentSuccessful(data: {
    reservationId: string;
    seatId: string;
    userId: number;
  }) {
    const lockKey = `seatLock:${data.seatId}`;

    const reservation = this.reservation.get(data.reservationId);
    if (!reservation) throw new NotFoundException('Reservation not found');

    const { seatId, lock } = reservation;
    // if (!lock) throw Error('seat lock is not defined');

    Logger.log(`seat locking on payment: ${lock.key}`);

    try {
      await this.database.seat.update({
        where: { seatId: data.seatId },
        data: { status: 'BOOKED' },
      });

      await this.redlock.release(lockKey, lock);

      this.reservation.delete(data.reservationId);
      Logger.log('seat is now released');
    } catch (error) {
      Logger.error('Failed to finalize booking', error);
      throw new Error(`Seat release failed. ${error}`);
    }
  }

  async releaseSeat(data: { reservationId: string; seatId: string }) {
    const lockKey = `seatLock:${data.seatId}`;
    Logger.log('seat released');
    const reservation = this.reservation.get(lockKey);

    const lock = reservation?.lock;
    if (!lock) throw Error('seat lock is not defined');

    this.redlock.release(lockKey, lock);
    this.reservation.delete(data.reservationId);
  }

  async getAllSeats(data: { eventId: string; userId: number }) {
    return await this.database.seat.findMany({
      select: { seatId: true, status: true },
    });
  }
  async getSeat(data: { seatId: string; userId: number }) {
    return await this.database.seat.findUnique({
      where: { seatId: data.seatId },
      select: { seatId: true, status: true },
    });
  }
}
