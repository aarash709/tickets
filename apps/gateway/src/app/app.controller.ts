import { Body, Controller, Get, Inject, Param, ParseIntPipe, ParseUUIDPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { BookSeatDto } from './dto/bookseat.dto';
import { v7 as uuidv7 } from 'uuid';
import { InventoryServive } from './constants';
import { BOOKING_PATTERNS } from './patterns';
import { BOOKING_STATUS } from './bookingstatus';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject(InventoryServive) private readonly kafkaClient: ClientKafka
  ) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('book')
  async book(@Body() bookDto: BookSeatDto) {
    const bookingId = uuidv7()
    const payload = {
      bookingId: bookingId,
      userId: bookDto.userId,
      seatId: bookDto.seatId,
      timeStamp: Date.now()
    }
    this.kafkaClient.emit(BOOKING_PATTERNS.BookingAttempt, payload)
    return {
      bookingId: bookingId,
      message: "Booking request accepted, Processing...",
      status: BOOKING_STATUS.PENDING
    }
  }

  @Get('book/status/:id')
  async getBookingStatus(@Param('id', ParseIntPipe) id: string) {
    //connect to redis
    return { status: BOOKING_STATUS.CHECKING, bookingId: id }
  }
}

