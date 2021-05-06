import { LocationEntity } from 'src/location/entities/location.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { UserRO } from '../ro/user.ro';

const TABLE_NAME = 'user';

@Entity(TABLE_NAME)
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'kc_id',
  })
  kcId: string;

  @Column({
    name: 'gu_id',
    nullable: true,
  })
  guId: string;

  @OneToOne(() => LocationEntity, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'location_id',
  })
  location?: LocationEntity;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  toResponseObject(): UserRO {
    return {
      id: this.id,
      kcId: this.kcId,
      guId: this.guId,
      location: this.location?.toResponseObject(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static tableName = TABLE_NAME;
}
