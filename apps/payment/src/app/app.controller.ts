import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@tickets/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(PAYMENT_PATTERNS.Pay)
  async handlePayment(
    @Payload() data: { reservationId: string; seatId: string; userId: number },
  ) {
    this.appService.paySeat(data);
  }
}
