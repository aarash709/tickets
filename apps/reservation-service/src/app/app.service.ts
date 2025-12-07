import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v7 as uuidv7 } from 'uuid';
import {
  Cache,
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
} from '@nestjs/cache-manager';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { SEAT_PATTERNS } from '@tickets/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private prisma: DatabaseService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    // @Inject('seat_service') private seatClient: ClientProxy,
  ) {}

  async handlePaymentSuccessful(data: { seatId: string }) {
    // this.seatClient.emit(SEAT_PATTERNS.Booked, { seatId: data.seatId });
  }

  async handlePaymentFailed(data: { seatId: string }) {
    // this.seatClient.emit(SEAT_PATTERNS.Released, { seatId: data.seatId });
  }

  async reserve(data: any) {
    //check redis
    //check db
    //set redis
    //return from db or redis
    //talk to seat service sear.booked or seat.reserved or release
    console.log('data from nats to reserve service', data);
    //setlock
    const reservationId = uuidv7();
    const expiresAt = new Date(Date.now() + 300 * 1000); // 5mins
    //set seats sevice to sererved
    // const seat = await firstValueFrom(
    //   this.seatClient.send(SEAT_PATTERNS.TryReserve, {
    //     seatId: data.seatId,
    //     reservationId: reservationId,
    //     userId: data.userId,
    //   }),
    // );
    // if (!seat.ok) throw new ConflictException('seat not avalible');
    // const newReservation = await this.prisma.reservation.create({
    //   data: {
    //     reservationId: reservationId,
    //     seatId: data.seatId,
    //     userId: data.userId,
    //     status: 'ACTIVE',
    //     expiresAt: expiresAt,
    //   },
    // });
    // this.cache.set(`reservation:${reservationId}`, `${data.seatId}`);
    // emit seat reserved for read-model
    //releaselock
    return { reservationId: reservationId, expiresAt: expiresAt };
  }
}
