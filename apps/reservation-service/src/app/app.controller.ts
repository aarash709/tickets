import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { PAYMENT_PATTERNS, SEAT_PATTERNS } from '@tickets/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // @Inject('payment_service') private readonly paymentKafkaClient: ClientKafka,
  ) {}

  @MessagePattern(SEAT_PATTERNS.TryReserve)
  async reserve(@Payload() data: { seatId: number; userId: number }) {
    return this.appService.reserve(data);
  }

  @MessagePattern(PAYMENT_PATTERNS.Succeed)
  async handlePaymentSuccessful(data: { seatId: string }) {
    this.appService.handlePaymentSuccessful(data);
  }

  @MessagePattern(PAYMENT_PATTERNS.Failed)
  async handlePaymentFailed(data: { seatId: string }) {
    this.appService.handlePaymentFailed(data);
  }
}
