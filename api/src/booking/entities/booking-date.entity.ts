import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingPeriod } from '../enums/booking-period.enum';
import { BookingEntity } from './booking.entity';

@Entity('bookingDate')
export class BookingDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => BookingEntity,
    booking => booking.dates,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  booking: BookingEntity;

  @Column({ nullable: false })
  date: Date;

  @Column('enum', {
    enum: BookingPeriod,
    nullable: false,
    default: BookingPeriod.MORNING,
    name: 'period',
  })
  period: BookingPeriod;

  @Column('time', {
    name: 'arrival_time',
    nullable: true,
  })
  arrivalTime: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
