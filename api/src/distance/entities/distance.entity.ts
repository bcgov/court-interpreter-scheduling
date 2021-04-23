import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('distance')
export class DistanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'intp_addr', nullable: false })
  intpAddr: string;

  @Column({ name: 'court_addr', nullable: false })
  courtAddr: string;

  @Column({ type: 'real', nullable: true })
  distance: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
