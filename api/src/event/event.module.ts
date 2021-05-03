import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';

import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';

import { BookingModule } from 'src/booking/booking.module';
import { InterpreterModule } from 'src/interpreter/interpreter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterpreterEventEntity,
      BookingEventEntity,
    ]),
    InterpreterModule,
    BookingModule,
  ],
  providers: [EventService]
})
export class EventModule {}
