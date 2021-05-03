import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';

import { LanguageEntity } from 'src/language/entities/language.entity';

import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { InterpreterModule } from 'src/interpreter/interpreter.module';

import { BookingModule } from 'src/booking/booking.module';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { BookingDateEntity } from 'src/booking/entities/booking-date.entity';
import { LocationEntity } from 'src/location/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LanguageEntity,
      InterpreterEntity,
      BookingEntity,
      BookingDateEntity,
      LocationEntity
    ]),
    InterpreterModule,
    BookingModule,
  ],
  providers: [EventService]
})
export class EventModule {}
