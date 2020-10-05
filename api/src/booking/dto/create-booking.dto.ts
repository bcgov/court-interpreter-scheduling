import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import * as faker from 'faker/locale/en_CA';
import { BookingPeriod } from '../enums/booking-period.enum';
import { BookingStatus } from '../enums/booking-status.enum';
import { BookingDateDto } from './booking-date.dto';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Interpreter id',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  interpreterId: number;

  @ApiProperty({
    description: 'Booking case name',
    example: faker.lorem.word(),
  })
  @IsNotEmpty()
  caseName: string;

  @ApiProperty({
    description: 'Booking status',
    example: BookingStatus.PENDING,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status: string;

  @ApiProperty({
    description: 'Booking date',
    example: [
      {
        date: faker.date.recent(),
        arrivalTime: '10:00',
        period: BookingPeriod.MORNING,
      },
    ],
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BookingDateDto)
  dates: BookingDateDto[];

  @ApiProperty({
    description: 'Booking registry',
    example: 'registry',
  })
  @IsOptional()
  registry: string;

  @ApiProperty({
    description: 'Booking file',
    example: 'file',
  })
  @IsOptional()
  file: string;

  @ApiProperty({
    description: 'Booking interpretFor',
    example: 'defendant',
  })
  @IsOptional()
  interpretFor: string;

  @ApiProperty({
    description: 'Booking requestedBy',
    example: 'prosecutor',
  })
  @IsOptional()
  requestedBy: string;

  @ApiProperty({
    description: 'Booking federal',
    example: true,
  })
  @IsOptional()
  federal: boolean;

  @ApiProperty({
    description: 'Booking Language name from Language Entity',
    example: 'French',
  })
  @IsOptional()
  language: string;

  @ApiProperty({
    description: 'Booking reason',
    example: faker.lorem.sentence(),
  })
  @IsOptional()
  reason: string;

  @ApiProperty({
    description: 'Booking prosecutor',
    example: 'prosecutor',
  })
  @IsOptional()
  prosecutor: string;

  @ApiProperty({
    description: 'Booking comment',
    example: faker.lorem.sentence(),
  })
  @IsOptional()
  comment: string;
}
