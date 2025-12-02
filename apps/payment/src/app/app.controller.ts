import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import {
  BOOKING_PATTERNS,
  InventoryDto,
  PAYMENT_PATTERNS,
  PaymentResultDto,
} from '@tickets/shared';
import { BookingService, InventoryServive } from './constants';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(InventoryServive)
    private readonly inventoryKafkaClient: ClientKafka,
    @Inject(BookingService) private readonly bookingKafkaClient: ClientKafka,
  ) {}

  @EventPattern(BOOKING_PATTERNS.SeatReserved)
  async handlePayment(@Payload() data: InventoryDto) {
    Logger.log('processing payment..');
    await new Promise((r) => setTimeout(r, 3000));
    const isDone = Math.random() < 0.8;
    if (isDone) {
      this.bookingKafkaClient.emit(PAYMENT_PATTERNS.Payment_Success, { data });
    } else {
      const failedPayload: PaymentResultDto = {
        reason: 'insufficient funds',
        ...data,
      };
      this.inventoryKafkaClient.emit(PAYMENT_PATTERNS.Payment_Failed, failedPayload);
    }
    Logger.log('payment is done..');
  }
}
