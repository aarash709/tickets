import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { NATSService } from './..//constants';
import { BOOKING_STATUS, SEAT_PATTERNS } from '@tickets/shared';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ReserveSeatDto } from '../dto/reserve.seat.dto';
import { ReserveSeatResultDto } from '../dto/reserve.seat.result.dto';

@ApiBearerAuth()
@Controller()
export class SeatsController {
  constructor(
    @Inject(NATSService)
    private readonly natsClient: ClientNats,
  ) {}

  @ApiOperation({ description: 'Gets all seats from an ongoind event' })
  @Get('seat/status/:id')
  async getBookingStatus(@Param('id', ParseIntPipe) id: string) {
    console.log(`status seatid: ${id}`);
    //connect to redis
    return { status: BOOKING_STATUS.CHECKING, bookingId: id };
  }

  @ApiOperation({ description: 'Reserves a seat from an ongoing event' })
  @ApiOkResponse({ description: 'Seat reserved successfully!' })
  @Post('seat/reserve')
  async reserveSeat(@Body() reserveDto: ReserveSeatDto) {
    const seat = firstValueFrom(
      this.natsClient.send<ReserveSeatResultDto, ReserveSeatDto>(
        SEAT_PATTERNS.TryReserve,
        reserveDto,
      ),
    );
    return seat;
  }
}
