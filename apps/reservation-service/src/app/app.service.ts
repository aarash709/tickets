import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private database: DatabaseService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async handlePaymentSuccessful(data: { seatId: string; userId: number }) {
    const lockKey = `seatLock:${data.seatId}`;
    const owner = await this.cache.get(lockKey);
    Logger.log(`${owner}`);

    if (owner !== data.userId) {
      Logger.log('another user tried to pay returning...');
      return;
    }
    await this.database.seat.update({
      where: { seatId: data.seatId },
      data: { status: 'AVAILABLE' },
    });
    await this.cache.del(lockKey);
    Logger.log('seat is now released');
  }

  async reserve(data: any) {
    const lockKey = `seatLock:${data.seatId}`;
    const ttl = 60 * 100;
    //check redis
    //check db
    //set redis
    //return from db or redis
    //talk to seat service sear.booked or seat.reserved or release

    const isSeatLocked = await this.cache.get(lockKey);
    Logger.log(`${isSeatLocked}`);
    if (isSeatLocked) {
      Logger.log('seat is currently taken and cannot be reserved');
      throw new RpcException('seat cannot be reseved!');
    }

    // const reservationId = uuidv7();
    // const expiresAt = new Date(Date.now() + 300 * 1000); // 5mins
    // const seatAvailible = await this.database.seat.findUnique({
    //   where: { seatId: data.seatid },
    // });
    // if (!seatAvailible) {
    //   Logger.log('seat not found!');
    //   return;
    // }
    const reservedSeat = await this.database.seat.update({
      where: { seatId: data.seatId },
      data: { status: 'RESERVED' },
    });

    Logger.log('seat is reserved and waiting for payment');
    if (!reservedSeat) throw new RpcException('seat not avalible');
    await this.cache.set(lockKey, data.userId, 0);
    // emit seat reserved for read-model
    Logger.log(`seatLock :${await this.cache.get(lockKey)}`);
    return {
      status: 'LOCKED',
      expiresIn: new Date(Date.now() + ttl),
      paymentToken: `pay_${data.seatId}_${data.userId}`, // Mock token for payment service
    };
  }

  async releaseSeat(data: { seatId: string }) {
    const lockKey = `seatLock:${data.seatId}`;
    Logger.log('seat released');
    await this.cache.del(lockKey);
  }
}
