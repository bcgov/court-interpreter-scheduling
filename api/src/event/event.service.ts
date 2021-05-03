import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';

import { BookingEntity } from 'src/booking/entities/booking.entity';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { UpdateInterpreterDto } from 'src/interpreter/dto/update-interpreter.dto';

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

  async parseInterpreterUpdate(original: InterpreterEntity, updateDto: UpdateInterpreterDto) {
    const updates = [];
    for (const k in original) {
      if (original[k] !== updateDto[k] && updateDto[k]) {
        updates.push({
          field: k,
          previous: original[k],
          updated: updateDto[k],
        })
      }
    }
    return updates;
  }
  
  async parseBookingUpdate(original: BookingEntity, updateDto: UpdateBookingDto) {
    const updates = [];
    for (const k in original) {
      if (original[k] !== updateDto[k] && updateDto[k]) {
        updates.push({
          field: k,
          previous: original[k],
          updated: updateDto[k],
        })
      }
    }
    return updates;
  }
}
