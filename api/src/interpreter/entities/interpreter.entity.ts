import { BookingEntity } from 'src/booking/entities/booking.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { InterpreterLanguageEntity } from './interpreter-language.entity';

@Entity('interpreter')
export class InterpreterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @OneToMany(
    type => InterpreterLanguageEntity,
    (interpreterLanguage: InterpreterLanguageEntity) =>
      interpreterLanguage.interpreter,
  )
  languages: InterpreterLanguageEntity[];

  @OneToMany(
    type => BookingEntity,
    (booking: BookingEntity) => booking.interpreter,
  )
  bookings: BookingEntity[];

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true, name: 'postal' })
  postal: string;

  @Column({ nullable: true, name: 'home_phone' })
  homePhone: string;

  @Column({ nullable: true, name: 'business_phone' })
  businessPhone: string;

  @Column({ nullable: true, name: 'phone' })
  phone: string;

  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  gst: string;

  @Column({ nullable: true })
  comments: string;

  @Column({ nullable: true, name: 'contract_extension' })
  contractExtension: boolean;

  @Column({ nullable: true, name: 'contract_termination' })
  contractTermination: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
