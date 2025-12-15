import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum EventStatus {
  PENDING = 'Pending',
  SOLD_OUT = 'Soldout',
  CANCELLED = 'Cancelld',
  FINISHED = 'Finished',
}
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsEnum(EventStatus)
  @IsNotEmpty()
  status!: EventStatus;
}
