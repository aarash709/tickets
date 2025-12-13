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
}
