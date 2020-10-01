import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingDateDto } from '../dto/booking-date.dto';

import { BookingStatus } from '../enums/booking-status.enum';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => InterpreterEntity,
    interpreter => interpreter.id,
  )
  interpreter: InterpreterEntity;

  @Column()
  caseName: string;

  @Column({ nullable: true })
  room: string;

  @Column('enum', {
    enum: BookingStatus,
    nullable: false,
    default: BookingStatus.PENDING,
    name: 'status',
  })
  status: string;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  dates: BookingDateDto[];

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
    { eager: true },
  )
  language: LanguageEntity;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  prosecutor: string;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}