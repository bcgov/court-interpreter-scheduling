import { ApiProperty } from '@nestjs/swagger';

import { BookingStatus } from '../enums/booking-status.enum';
import { LangRO } from 'src/language/ro/lang.ro';
import { EventRO } from 'src/event/ro/event.ro';
import { BookingDateRO } from './booking-date.ro';
import { InterpreterRO } from 'src/interpreter/ro/interpreter.ro';
import { LocationEntity } from 'src/location/entities/location.entity';

export class BookingRO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  interpreter: InterpreterRO;

  @ApiProperty()
  caseName: string;

  @ApiProperty()
  room: string;

  @ApiProperty()
  status: BookingStatus;

  @ApiProperty()
  dates: BookingDateRO[];

  @ApiProperty()
  registry: string;

  @ApiProperty()
  file: string;

  @ApiProperty()
  interpretFor: string;

  @ApiProperty()
  requestedBy: string;

  @ApiProperty()
  federal: boolean;

  @ApiProperty()
  language: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  prosecutor: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  location: LocationEntity;

  @ApiProperty()
  events: EventRO[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  locationName?: string;
}
