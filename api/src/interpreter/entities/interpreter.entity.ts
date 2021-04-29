import { BookingEntity } from 'src/booking/entities/booking.entity';
import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { InterpreterRO } from '../ro/interpreter.ro';

import { InterpreterLanguageEntity } from './interpreter-language.entity';

const TABLE_NAME = 'interpreter';

@Entity(TABLE_NAME)
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
    (interpreterLanguage: InterpreterLanguageEntity) => interpreterLanguage.interpreter,
    { eager: true },
  )
  languages: InterpreterLanguageEntity[];

  @OneToMany(
    type => BookingEntity,
    (booking: BookingEntity) => booking.interpreter,
  )
  bookings: BookingEntity[];

  @OneToMany(
    type => InterpreterEventEntity,
    (event: InterpreterEventEntity) => event.interpreter,
  )
  events: InterpreterEventEntity[];

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

  @Column({
    nullable: true,
    name: 'criminal_record_check_comment',
  })
  criminalRecordCheck: string;

  @Column({
    nullable: true,
    name: 'criminal_record_check_date',
  })
  criminalRecordCheckDate: Date;

  @Column({ nullable: true })
  fax: string;

  @Column({
    nullable: true,
    name: 'email_alt',
  })
  emailAlt: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  gst: string;

  @Column({ nullable: true })
  comments: string;

  @Column({ nullable: true, name: 'admin_comments' })
  adminComments: string;

  @Column({ nullable: true, name: 'contract_extension' })
  contractExtension: boolean;

  @Column({ nullable: true, name: 'contract_termination' })
  contractTermination: boolean;

  @Column({ nullable: true, name: 'page12_contract' })
  page12ContractReceived: string;

  @Column({ nullable: true, select: false, insert: false, readonly: true })
  intpAddr?: string;

  @Column({ nullable: true, select: false, insert: false, readonly: true })
  distance?: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  toResponseObject(): InterpreterRO {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      languages: this.languages
        .map((intLang: InterpreterLanguageEntity) => intLang.toResponseObject())
        .sort((a, b) => a.level - b.level),
      events: this.events.map(e => e.toResponseObject()),
      bookings: this.bookings,
      address: this.address,
      city: this.city,
      province: this.province,
      postal: this.postal,
      homePhone: this.homePhone,
      businessPhone: this.businessPhone,
      phone: this.phone,
      email: this.email,
      supplier: this.supplier,
      gst: this.gst,
      criminalRecordCheck: this.criminalRecordCheck,
      criminalRecordCheckDate: this.criminalRecordCheckDate,
      comments: this.comments,
      adminComments: this.adminComments,
      contractExtension: this.contractExtension,
      intpAddr: this.intpAddr,
      distance: this.distance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static getSearchColums() {
    return [
      'address',
      'city',
      'province',
      'postal',
      'homePhone',
      'businessPhone',
      'phone',
      'email',
      'supplier',
      'gst',
      'comments',
      'contractExtension',
      'criminalRecordCheckDate',
    ];
  }

  static tableName = TABLE_NAME;
}
