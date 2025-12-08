import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { InventoryDto, PAYMENT_PATTERNS } from '@tickets/shared';

@Injectable()
export class AppService {
  constructor(
    @Inject('nats-service') private readonly natsClient: ClientNats,
  ) {}
  async paySeat(data: InventoryDto) {
    Logger.log('processing payment..');

    //simulated payment
    await new Promise((r) => setTimeout(r, 3000));
    const isPaymentSuccessful = Math.random() > 0.1;

    if (isPaymentSuccessful) {
      this.natsClient.emit(PAYMENT_PATTERNS.Succeed, { data });
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
