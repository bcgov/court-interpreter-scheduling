import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => InterpreterEntity,
    interpreter => interpreter.id,
  )
  interpreter: InterpreterEntity;

  @Column()
  status: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  registry: string;

  @Column()
  file: string;

  @Column()
  interpretFor: string;

  @Column()
  caseName: string;

  @Column()
  requestedBy: string;

  @Column()
  federal: string;

  @Column()
  language: string;

  @Column()
  reason: string;

  @Column()
  prosecutor: string;

  @Column()
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
