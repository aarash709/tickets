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
  constructor(private readonly appService: AppService) {}

  @EventPattern(PAYMENT_PATTERNS.Pay)
  async handlePayment(@Payload() data: InventoryDto) {
    this.appService.paySeat(data);
  }
}
