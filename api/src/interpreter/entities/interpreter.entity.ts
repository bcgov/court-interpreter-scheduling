import { LanguageEntity } from 'src/language/entities/language.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
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

  @ManyToOne(
    type => LanguageEntity,
    (language: LanguageEntity) => language.id,
  )
  language: LanguageEntity;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  distance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
