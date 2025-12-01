import { IsInt, IsNotEmpty } from "class-validator"

export class BookSeatDto {
    @IsInt()
    @IsNotEmpty()
    userId!: number

    @IsInt()
    @IsNotEmpty()
    seatId!: number
}