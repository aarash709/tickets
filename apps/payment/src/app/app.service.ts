import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@tickets/shared';
import { NatsService } from './constants';

@Injectable()
export class AppService {
  constructor(@Inject(NatsService) private readonly natsClient: ClientNats) {}
  async paySeat(data: {
    reservationId: string;
    seatId: string;
    userId: number;
  }) {
    Logger.log('processing payment..');

    //simulated payment
    await new Promise((r) => setTimeout(r, 3000));
    const isPaymentSuccessful = Math.random() > 0.1;

    if (isPaymentSuccessful) {
      this.natsClient.emit(PAYMENT_PATTERNS.Succeed, data);
      Logger.log('payment is successful!');
    } else {
      this.natsClient.emit(PAYMENT_PATTERNS.Failed, {
        reason: 'Insufficient funds!',
        ...data,
      });
      Logger.log('payment failed..');
    }
  }
}
