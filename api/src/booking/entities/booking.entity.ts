import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookingStatus } from '../enums/booking-status.enum';
import { BookingRO } from '../ro/booking.ro';
import { BookingDateEntity } from './booking-date.entity';

import { sortBookingDates } from 'src/utils';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => InterpreterEntity,
    interpreter => interpreter.id,
    { onDelete: 'SET NULL' },
  )
  interpreter: InterpreterEntity;

  @Column({ nullable: true })
  caseName: string;

  @Column({ nullable: true })
  room: string;

  @Column('enum', {
    enum: BookingStatus,
    nullable: false,
    default: BookingStatus.PENDING,
    name: 'status',
  })
  status: BookingStatus;

  @OneToMany(
    type => BookingDateEntity,
    (bookingDate: BookingDateEntity) => bookingDate.booking,
  )
  dates: BookingDateEntity[];

  @Column({ nullable: true })
  registry: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true })
  interpretFor: string;

  @Column({ nullable: true })
  requestedBy: string;

  @Column({ default: false })
  federal: boolean;

  @ManyToOne(
    type => LanguageEntity,
    (language: LanguageEntity) => language.name,
    { eager: true, onDelete: 'SET NULL' },
  )
  language: LanguageEntity;

  @ManyToOne(type => LocationEntity, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({
    name: 'court_location_id',
    referencedColumnName: 'id',
  })
  location: LocationEntity;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  prosecutor: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true, name: 'method_of_appearance' })
  methodOfAppearance: string;

  @OneToMany(
    type => BookingEventEntity,
    (event: BookingEventEntity) => event.booking,
  )
  events: BookingEventEntity[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  toResponseObject(): BookingRO {
    const languageName = this.language?.toResponseObject()?.name;
    return {
      id: this.id,
      interpreter: this.interpreter?.toResponseObject(),
      caseName: this.caseName,
      room: this.room,
      status: this.status,
      dates: this.dates.map(d => d.toResponseObject()).sort(sortBookingDates),
      registry: this.registry,
      file: this.file,
      interpretFor: this.interpretFor,
      requestedBy: this.requestedBy,
      federal: this.federal,
      language: languageName,
      reason: this.reason,
      prosecutor: this.prosecutor,
      comment: this.comment,
      methodOfAppearance: this.methodOfAppearance,
      events: this.events?.map(e => e.toResponseObject()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      location: this.location,
    };
  }
}
