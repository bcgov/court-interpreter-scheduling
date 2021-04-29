import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LanguageEntity } from 'src/language/entities/language.entity';

import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { InterpreterModule } from 'src/interpreter/interpreter.module';

import { EventService } from 'src/event/event.service';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';
import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';

import { BookingEntity } from './entities/booking.entity';
import { BookingDateService } from './booking-date.service';
import { BookingDateEntity } from './entities/booking-date.entity';
import { LocationEntity } from 'src/location/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LanguageEntity,
      InterpreterEntity,
      BookingEntity,
      BookingDateEntity,
      LocationEntity,
      InterpreterEventEntity,
      BookingEventEntity,
    ]),
    InterpreterModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingDateService, EventService],
})
export class BookingModule {}
