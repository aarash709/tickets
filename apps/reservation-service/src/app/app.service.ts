import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MurLock } from 'murlock/dist/decorators';
import { MurLockService } from 'murlock';

@Injectable()
export class AppService {
  constructor(
    private database: DatabaseService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private murlockService: MurLockService,
  ) {}

  async handlePaymentSuccessful(data: { seatId: string; userId: number }) {
    const lockKey = `seatLock:${data.seatId}`;
    // const owner = await this.cache.get(lockKey);
    // Logger.log(`${owner}`);

    // if (owner !== data.userId) {
    //   Logger.log('another user tried to pay returning...');
    //   return;
    // }
    await this.database.seat.update({
      where: { seatId: data.seatId },
      data: { status: 'AVAILABLE' },
    });
    // await this.cache.del(lockKey);
    Logger.log('seat is now released');
  }

  @MurLock(60 * 5 * 1000, 'data.seatId')
  async reserve(data: { seatId: string; userId: number }) {
    const lockKey = `seatLock:${data.seatId}`;
    const ttl = 60 * 5 * 1000;

    try {
      const seatResult = await this.database.$transaction(async (tx) => {
          const seat = await tx.seat.findUnique({
            where: { seatId: data.seatId, status: 'AVAILABLE' },
          });
          if (!seat) throw Error('seat not availible');
          const reservedSeat = tx.seat.update({
            where: { seatId: seat?.seatId },
            data: { status: 'RESERVED' },
          });
          Logger.log('seat is reserved and waiting for payment');
          return reservedSeat;
        });
        return {
          seatId: seatResult.seatId,
          status: seatResult.status,
          lockExpiresIn: new Date(Date.now() + ttl),
        };
    } catch (error) {
      throw Error(`reservation failed!'${error}`);
    }
  }

  async releaseSeat(data: { seatId: string }) {
    const lockKey = `seatLock:${data.seatId}`;
    Logger.log('seat released');
    await this.cache.del(lockKey);
  }
}
