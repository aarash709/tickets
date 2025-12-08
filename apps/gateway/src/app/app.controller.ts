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
import { ClientKafka, ClientNats } from '@nestjs/microservices';
import { v7 as uuidv7 } from 'uuid';
import { InventoryServive, PaymentService, ReserveService } from './constants';
import {
  BOOKING_PATTERNS,
  BOOKING_STATUS,
  InventoryDto,
  PAYMENT_PATTERNS,
  SEAT_PATTERNS,
} from '@tickets/shared';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(PaymentService)
    private readonly paymentNatsClient: ClientNats,
    @Inject(ReserveService)
    private readonly reserveNatsClient: ClientNats,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  // @Post('book')
  // async book(@Body() bookDto: any) {
  //   const bookingId = uuidv7();
  //   const payload: InventoryDto = {
  //     bookingId: bookingId,
  //     userId: bookDto.userId,
  //     seatId: bookDto.seatId,
  //     timeStamp: new Date(),
  //   };
  //   this.inventoryKafkaClient.emit(BOOKING_PATTERNS.BookingAttempt, payload);
  //   console.log('attemp', BOOKING_PATTERNS.BookingAttempt);
  //   return {
  //     bookingId: bookingId,
  //     message: 'Booking request accepted, Processing...',
  //     status: BOOKING_STATUS.PENDING,
  //   };
  // }

  @Get('seat/status/:id')
  async getBookingStatus(@Param('id', ParseIntPipe) id: string) {
    console.log(`status seatid: ${id}`);
    //connect to redis
    return { status: BOOKING_STATUS.CHECKING, bookingId: id };
  }

  @Post('seat/reserve')
  async reserveSeat(@Body() reserveData: { seatId: string; userId: number }) {
    const seat = firstValueFrom(
      this.reserveNatsClient.send<
        { reservationId: number },
        typeof reserveData
      >(SEAT_PATTERNS.TryReserve, reserveData),
    );
    return seat;
  }

  @Post('seat/pay')
  async paySeat(@Body() reservationData: { seatId: string; userId: number }) {
    console.log(`pay data: `, reservationData);
    firstValueFrom(
      this.paymentNatsClient.emit(PAYMENT_PATTERNS.Pay, reservationData),
    );
    return reservationData;
  }
}
