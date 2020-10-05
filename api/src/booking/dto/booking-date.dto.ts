import { IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import * as faker from 'faker/locale/en_CA';
import { ApiProperty } from '@nestjs/swagger';

import { BookingPeriod } from '../enums/booking-period.enum';

export interface BookingDate {
  date: Date;
  period: BookingPeriod;
}

export class BookingDateDto {
  @ApiProperty({
    description: 'booking date',
    example: faker.date.recent(),
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Booking period',
    example: BookingPeriod.MORNING,
    enum: BookingPeriod,
  })
  @IsNotEmpty()
  @IsEnum(BookingPeriod)
  period: BookingPeriod;

  @ApiProperty({
    description: 'Booking arrival time, 24 hours format: HH:MM',
    example: '12:00',
  })
  @IsNotEmpty()
  arrivalTime: string;
}
