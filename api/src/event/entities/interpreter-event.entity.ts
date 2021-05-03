import { Entity, ManyToOne } from 'typeorm';

import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { EventEntity } from 'src/event/entities/event.entity';

import { EventRO } from 'src/event/ro/event.ro';

@Entity('interpreter_event')
export class InterpreterEventEntity extends EventEntity {

  @ManyToOne(
    type => InterpreterEntity,
    interpreter => interpreter.id,
    { onDelete: 'SET NULL' },
  )
  interpreter: InterpreterEntity;

  toResponseObject(): EventRO {
    return {
      id: this.id,
      previous: this.previous,
      updated: this.updated,
      // placeholder until user table is ready
      // user: this.user.firstName,
      createdAt: this.createdAt,
    }
  }
};
