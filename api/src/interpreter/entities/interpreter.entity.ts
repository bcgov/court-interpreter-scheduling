import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Level } from '../enums/level.enum';

@Entity('interpreter')
export class InterpreterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('enum', {
    enum: Level,
    nullable: false,
    default: Level.one,
    name: 'level',
  })
  level: Level;

  @Column()
  language: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
