import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PAYMENT_PATTERNS, SEAT_PATTERNS } from '@tickets/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(SEAT_PATTERNS.TryReserve)
  async reserve(@Payload() data: { seatId: string; userId: number }) {
    return this.appService.reserve(data);
  }

  @EventPattern(PAYMENT_PATTERNS.Succeed)
  async handlePaymentSuccessful(data: {
    reservationId: string;
    seatId: string;
    userId: number;
  }) {
    this.appService.handlePaymentSuccessful(data);
  }

  @EventPattern(PAYMENT_PATTERNS.Failed)
  async handlePaymentFailed(data: { reservationId: string; seatId: string }) {
    this.appService.releaseSeat(data);
  }
}
