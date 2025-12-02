import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @EventPattern("payment.success")
  finalizeBooking() {
    Logger.log("Seat is now Booked...")
    //write to the database
    //change the status of the seat to BOOKED
    //handle redis
  }
}
