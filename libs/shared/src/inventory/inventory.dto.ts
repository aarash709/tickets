import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class InventoryDto {
    @IsUUID(7)
    bookingId!: string;
    @IsNotEmpty()
    @IsNumber()
    userId!: number;
    @IsNotEmpty()
    @IsNumber()
    seatId!: number;
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Date)
    timeStamp!: Date;
}
