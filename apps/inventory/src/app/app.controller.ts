import { Controller, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("payment_service") private readonly paymentKafkaClient: ClientKafka) { }

  @EventPattern("booking.attempt")
  handleBookingAttempt(@Payload() data: any) {
    Logger.log("inventory data", data)
    Logger.log("seat is reserved and locked")
    this.paymentKafkaClient.emit("seat.reserved", data)
  }

  @EventPattern('booking.failed')
  handleFailedBooking() {
    Logger.log("booking failed releasing locked seats...")
    //remove from redis and release locks
  }
}
