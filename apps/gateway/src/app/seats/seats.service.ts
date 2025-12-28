import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { NATSService } from './..//constants';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  CreateEventDto,
  EVENT_PATTERNS,
  ReserveSeatDto,
  SEAT_PATTERNS,
} from '@tickets/shared';
import { ReserveSeatResultDto } from '../dto/reserve.seat.result.dto';
import { PassportJwtGuard } from '../guards/jwt.gurad';
import { Role, Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@ApiBearerAuth()
@UseGuards(PassportJwtGuard)
@Controller()
export class SeatsController {
  constructor(
    @Inject(NATSService)
    private readonly natsClient: ClientNats,
  ) {}

  @ApiOperation({
    description: 'Gets status for all seats for an ongoind event',
  })
  @Get('event/seats/status/:id')
  async getAllSeatStatus(@Param('id') eventId: string) {
    console.log(`requested all seats status`);
    const seat = await firstValueFrom(
      this.natsClient.send<
        { seatId: number; status: string }[],
        { eventId: string }
      >(EVENT_PATTERNS.GET_ALL_SEATS, { eventId: eventId }),
    );
    return seat;
  }

  @ApiOperation({ description: 'Gets seat status for an ongoind event' })
  @Get('event/seat/status/')
  async getSeatStatus(
    @Query('seatId') seatId: string,
    @Query('eventId') eventId: string,
  ) {
    console.log(`requested seatId: %s eventId: %s`, seatId, eventId);
    const seats = await firstValueFrom(
      this.natsClient.send<
        { seatId: number; status: string },
        { seatId: string; eventId: string }
      >(EVENT_PATTERNS.GET_SEAT, { seatId: seatId, eventId: eventId }),
    );
    return seats;
  }

  @ApiOperation({ description: 'Reserves a seat from an ongoing event' })
  @ApiOkResponse({ description: 'Seat reserved successfully!' })
  @UseGuards(PassportJwtGuard, RolesGuard)
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

  @UseGuards(PassportJwtGuard, RolesGuard)
  @Post('event/new')
  @Roles([Role.Admin, Role.Moderator])
  async addEvent(@Body() eventData: CreateEventDto) {
    this.natsClient.emit(EVENT_PATTERNS.ADD_EVENT, eventData);
    return { test: 'test' };
  }

  @UseGuards(PassportJwtGuard, RolesGuard)
  @Patch('event')
  @Roles([Role.Admin, Role.Moderator])
  async modifyEvent(@Body() eventData: Partial<CreateEventDto>) {
    // this.natsClient.emit(EVENT_PATTERNS.UPDATE_EVENT, eventData);
    return eventData;
  }
}
