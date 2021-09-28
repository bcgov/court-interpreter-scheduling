import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ nullable: true })
  subfield: string;

  @Column()
  previous: string;

  @Column()
  updated: string;

  @Column({ nullable: true })
  language: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
