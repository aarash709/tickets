import { Controller, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import {
  BOOKING_PATTERNS,
  InventoryDto,
  PaymentResultDto,
} from '@tickets/shared';
import { Payment_Service } from './constants';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Payment_Service) private readonly paymentKafkaClient: ClientKafka,
  ) {}

  @EventPattern(BOOKING_PATTERNS.BookingAttempt)
  handleBookingAttempt(@Payload() data: InventoryDto) {
    Logger.log('inventory data', data);
    Logger.log('seat is reserved and locked');
    this.paymentKafkaClient.emit(BOOKING_PATTERNS.SeatReserved, data);
  }

  @EventPattern(BOOKING_PATTERNS.BookingFailed)
  handleFailedBooking(@Payload() data: PaymentResultDto) {
    Logger.log('booking failed releasing locked seats...');
    Logger.log('data', data);
    //remove from redis and release locks
  }
}
