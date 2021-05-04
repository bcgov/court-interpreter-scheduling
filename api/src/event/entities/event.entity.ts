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
import { UserEntity } from 'src/user/entities/user.entity';

export abstract class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => UserEntity,
    user => user.id,
    { onDelete: 'SET NULL' },
  )
  user: UserEntity;

  @Column()
  field: string;

  @Column()
  previous: string;

  @Column()
  updated: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

}
