import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { v7 as uuidv7 } from 'uuid';
import { InventoryServive } from './constants';
import {
  BOOKING_PATTERNS,
  BOOKING_STATUS,
  InventoryDto,
} from '@tickets/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(InventoryServive)
    private readonly inventoryKafkaClient: ClientKafka,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('book')
  async book(@Body() bookDto: any) {
    const bookingId = uuidv7();
    const payload: InventoryDto = {
      bookingId: bookingId,
      userId: bookDto.userId,
      seatId: bookDto.seatId,
      timeStamp: new Date(),
    };
    this.inventoryKafkaClient.emit(BOOKING_PATTERNS.BookingAttempt, payload);
    console.log('attemp', BOOKING_PATTERNS.BookingAttempt);
    return {
      bookingId: bookingId,
      message: 'Booking request accepted, Processing...',
      status: BOOKING_STATUS.PENDING,
    };
  }

  @Get('book/status/:id')
  async getBookingStatus(@Param('id', ParseIntPipe) id: string) {
    //connect to redis
    return { status: BOOKING_STATUS.CHECKING, bookingId: id };
  }
}
