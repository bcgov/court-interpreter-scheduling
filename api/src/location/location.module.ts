import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';
import { LocationFetchScheduleService } from './location-fetch-schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), ScheduleModule.forRoot()],
  controllers: [LocationController],
  providers: [LocationService, LocationFetchScheduleService],
})
export class LocationModule {}
