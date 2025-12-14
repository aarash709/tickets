import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReserveSeatResultDto {
  @ApiProperty({ example: 'R1-C1' })
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
