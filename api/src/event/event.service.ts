import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(InterpreterEventEntity)
    private readonly interpreterEventRepository: Repository<InterpreterEventEntity>,
    @InjectRepository(BookingEventEntity)
    private readonly bookingEventRepository: Repository<BookingEventEntity>,
  ) {}

  async createInterpreterEvent({ interpreterId, field, previous, updated }) {
    const e = this.interpreterEventRepository.create({
      field,
      previous,
      updated,
      interpreter: interpreterId,
    });
    return e;
  }
  
  async createBookingEvent({ bookingId, field, previous, updated}) {
    const e = this.bookingEventRepository.create({
      field,
      previous,
      updated,
      booking: bookingId,
    });
    return e;
  }
}
