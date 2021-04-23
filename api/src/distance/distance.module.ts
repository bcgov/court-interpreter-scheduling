import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DistanceService } from './distance.service';
import { DistanceController } from './distance.controller';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { InterpreterModule } from 'src/interpreter/interpreter.module';
import { LocationModule } from 'src/location/location.module';
import { DistanceEntity } from './entities/distance.entity';
import { LocationService } from 'src/location/location.service';
import { InterpreterService } from 'src/interpreter/interpreter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterpreterEntity, LocationEntity, DistanceEntity]),
    InterpreterModule,
    LocationModule,
  ],
  providers: [DistanceService, LocationService, InterpreterService],
  controllers: [DistanceController],
})
export class DistanceModule {}
