import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReserveSeatResultDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seatId!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reservationId!: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  lockExpiresIn!: number;
}
