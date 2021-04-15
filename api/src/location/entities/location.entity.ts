import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LocationRO } from '../ro/location.ro';

@Entity('court_location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'location_name',
  })
  name: string;

  @Column({
    name: 'location_code',
  })
  locationCode: string;

  @Column({
    name: 'address_line1',
    nullable: true,
  })
  addressLine1: string;

  @Column({
    name: 'address_line2',
    nullable: true,
  })
  addressLine2: string;

  @Column({
    name: 'city',
    nullable: true,
  })
  city: string;

  @Column({
    name: 'postal_code',
    nullable: true,
  })
  postalCode: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  toResponseObject(): LocationRO {
    return {
      name: this.name,
      locationCode: this.locationCode,
    };
  }
}
