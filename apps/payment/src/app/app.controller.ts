import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject("inventory_service") private readonly inventoryKafkaClient: ClientKafka,
    @Inject("booking_service") private readonly bookingKafkaClient: ClientKafka) { }

  @EventPattern("seat.reserved")
  async handlePayment(@Payload() data: any) {
    Logger.log("processing payment..")
    await new Promise((r) => setTimeout(r, 3000))
    const isDone = Math.random() < 0.8
    if (isDone) {
      this.bookingKafkaClient.emit("payment.success", data)
    } else {
      this.inventoryKafkaClient.emit("payment.failed", data)
    }
    Logger.log("payment is done..")
  }
}
