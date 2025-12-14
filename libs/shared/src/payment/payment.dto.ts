import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty({ description: 'Current reservationId' })
  @IsString()
  @IsNotEmpty()
  reservationId!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seatId!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
