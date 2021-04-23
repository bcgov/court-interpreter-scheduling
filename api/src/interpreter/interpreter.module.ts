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

@Module({
  imports: [TypeOrmModule.forFeature([InterpreterEntity, LanguageEntity, InterpreterLanguageEntity, DistanceEntity])],
  controllers: [InterpreterController],
  providers: [InterpreterService, InterpreterLanguageService, DistanceService],
})
export class InterpreterModule {}
