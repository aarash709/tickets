import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import {
  InventoryDto,
  PAYMENT_PATTERNS,
  PaymentResultDto,
} from '@tickets/shared';

@Injectable()
export class AppService {
  constructor(
    @Inject('nats-service') private readonly natsClient: ClientNats,
  ) {}
  async paySeat(data: InventoryDto) {
    Logger.log('processing payment..');
    await new Promise((r) => setTimeout(r, 3000));
    const isDone = Math.random() < 0.8;
    if (isDone) {
      this.natsClient.emit(PAYMENT_PATTERNS.Succeed, { data });
    } else {
      this.natsClient.emit(PAYMENT_PATTERNS.Failed, {
        reason: 'insufficient funds',
        ...data,
      });
      Logger.log('payment failed..');
    }
    Logger.log('payment is done..');
  }
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
