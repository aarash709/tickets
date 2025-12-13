import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReserveSeatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seatId!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: number;
}
