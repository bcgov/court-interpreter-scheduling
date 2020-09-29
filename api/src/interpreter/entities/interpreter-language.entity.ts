import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Level } from '../enums/level.enum';

@Entity('interpreterLanguage')
export class InterpreterLanguageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => InterpreterEntity,
    interpreter => interpreter.language,
  )
  interpreter: InterpreterEntity;

  @ManyToOne(
    type => LanguageEntity,
    (language: LanguageEntity) => language.name,
    { eager: true },
  )
  language: LanguageEntity;

  @Column('enum', {
    enum: Level,
    nullable: false,
    default: Level.one,
    name: 'level',
  })
  level: Level;

  @Column({ name: 'comment_on_level', nullable: true })
  commentOnLevel: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
