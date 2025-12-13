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
import { ClientNats } from '@nestjs/microservices';
import { NATSService } from './constants';
import {
  BOOKING_STATUS,
  PAYMENT_PATTERNS,
  SEAT_PATTERNS,
} from '@tickets/shared';
import { firstValueFrom } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(NATSService)
    private readonly natsClient: ClientNats,
  ) {}
  
  @Get()
  getData() {
    return this.appService.getData();
  }

  @ApiOperation({ description: 'Gets all seats from an ongoind event' })
  @Get('seat/status/:id')
  async getBookingStatus(@Param('id', ParseIntPipe) id: string) {
    console.log(`status seatid: ${id}`);
    //connect to redis
    return { status: BOOKING_STATUS.CHECKING, bookingId: id };
  }

  @ApiOperation({ description: 'Reserves a seat from an ongoing event' })
  @Post('seat/reserve')
  async reserveSeat(@Body() reserveData: { seatId: string; userId: number }) {
    const seat = firstValueFrom(
      this.natsClient.send<
        {
          seatId: string;
          status: string;
          reservationId: string;
          lockExpiresIn: number;
        },
        typeof reserveData
      >(SEAT_PATTERNS.TryReserve, reserveData),
    );
    return seat;
  }

  @ApiOperation({ description: 'Pays the reserved seat' })
  @Post('seat/pay')
  async paySeat(
    @Body()
    reservationData: {
      reservationId: string;
      seatId: string;
      userId: number;
    },
  ) {
    console.log(`pay data: `, reservationData);
    firstValueFrom(this.natsClient.emit(PAYMENT_PATTERNS.Pay, reservationData));
    return reservationData;
  }
}
