import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('interpreter')
export class InterpreterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
    nullable: true,
    default: 'english',
    name: 'name',
  })
  name: string;
}
