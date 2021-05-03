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

export abstract class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // leaving this here for when user entity is ready
  // @ManyToOne(
  //   type => UserEntity,
  //   user => user.id,
  //   { onDelete: 'SET NULL' },
  // )
  // user: UserEntity;

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
