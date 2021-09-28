import { Module } from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { InterpreterController } from './interpreter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterpreterEntity } from './entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterLanguageService } from './interpreter-language.service';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { DistanceService } from 'src/distance/distance.service';
import { DistanceEntity } from 'src/distance/entities/distance.entity';

import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';
import { EventService } from 'src/event/event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterpreterEntity,
      LanguageEntity,
      InterpreterLanguageEntity,
      DistanceEntity,
      InterpreterEventEntity,
      BookingEventEntity,
    ]),
  ],
  controllers: [InterpreterController],
  providers: [InterpreterService, InterpreterLanguageService, DistanceService, EventService],
})
export class InterpreterModule {}
