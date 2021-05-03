import { Entity, ManyToOne } from 'typeorm';

import { BookingEntity } from 'src/booking/entities/booking.entity';
import { EventEntity } from 'src/event/entities/event.entity';

import { EventRO } from 'src/event/ro/event.ro';

@Entity('booking_event')
export class BookingEventEntity extends EventEntity {

  @ManyToOne(
    type => BookingEntity,
    booking => booking.id,
    { onDelete: 'SET NULL' },
  )
  booking: BookingEntity;

  toResponseObject(): EventRO {
    // we don't need to return the booking as this entity will be joined off the booking table
    return {
      id: this.id,
      field: this.field,
      previous: this.previous,
      updated: this.updated,
      // placeholder until user table is ready
      // user: this.user.firstName,
      createdAt: this.createdAt,
    }
  }
};
