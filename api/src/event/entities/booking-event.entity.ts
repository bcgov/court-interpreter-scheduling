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
    return {
      id: this.id,
      field: this.field,
      previous: this.previous,
      updated: this.updated,
      // user: `${this.user?.firstName} ${this.user?.lastName}`,
      createdAt: this.createdAt,
    }
  }
};
