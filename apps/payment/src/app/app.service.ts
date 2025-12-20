import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientNats, RpcException } from '@nestjs/microservices';
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
    try {
      const isPaymentSuccessful = await this.simulatePayment();
      if (isPaymentSuccessful) {
        this.natsClient.emit(PAYMENT_PATTERNS.Succeed, data);
      } else {
        this.natsClient.emit(PAYMENT_PATTERNS.Failed, {
          reason: 'Insufficient funds!',
          ...data,
        });
        Logger.log('payment failed..');
      }
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: `Internal Server Error: ${error}`,
      });
    }
  }

  async simulatePayment(): Promise<boolean> {
    Logger.log('processing payment..');
    //simulated payment
    await new Promise((r) => setTimeout(r, 3000));
    const isPaymentSuccessful = Math.random() > 0.1;
    Logger.log('payment is successful!');
    return isPaymentSuccessful;
  }
}
