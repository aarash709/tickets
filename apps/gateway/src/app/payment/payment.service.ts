import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { NATSService } from './..//constants';
import { PAYMENT_PATTERNS } from '@tickets/shared';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentDto } from '@tickets/shared';
import { PassportJwtGuard } from '../guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(PassportJwtGuard)
@Controller()
export class PaymentController {
  constructor(
    @Inject(NATSService)
    private readonly natsClient: ClientNats,
  ) {}

  @ApiOperation({ description: 'Pays the reserved seat' })
  @UseGuards(PassportJwtGuard)
  @Post('seat/pay')
  async paySeat(
    @Body()
    paymentDto: PaymentDto,
  ) {
    console.log(`pay data: `, paymentDto);
    firstValueFrom(this.natsClient.emit(PAYMENT_PATTERNS.Pay, paymentDto));
    return paymentDto;
  }
}
