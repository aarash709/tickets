import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  EVENT_PATTERNS,
  PAYMENT_PATTERNS,
  SEAT_PATTERNS,
} from '@tickets/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(SEAT_PATTERNS.TryReserve)
  async reserve(@Payload() data: { seatId: string; userId: number }) {
    return await this.appService.reserve(data);
  }

  @MessagePattern(EVENT_PATTERNS.GET_SEAT)
  async getSeat(@Payload() data: { seatId: string; userId: number }) {
    return await this.appService.getSeat(data);
  }

  @MessagePattern(EVENT_PATTERNS.GET_ALL_SEATS)
  async getAllSeats(@Payload() data: { eventId: string; userId: number }) {
    return await this.appService.getAllSeats(data);
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
