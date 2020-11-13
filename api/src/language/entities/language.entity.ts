import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { LangRO } from '../ro/lang.ro';

@Entity('language')
export class LanguageEntity {
  @PrimaryColumn()
  name: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  toResponseObject(): LangRO {
    return {
      name: this.name,
    };
  }
}
