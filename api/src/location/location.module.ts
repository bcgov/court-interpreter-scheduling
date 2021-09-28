import { Module, Provider } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './entities/location.entity';
import { LocationFetchScheduleService } from './location-fetch-schedule.service';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';


@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), ScheduleModule.forRoot()],
  controllers: [LocationController],
  providers: [
    LocationService,
    ((): Provider => {
      if (!process.env.MAP_BOX_TOKEN) {
        return {
          provide: LocationFetchScheduleService,
          useFactory: () => undefined
        }
      } else {
        return LocationFetchScheduleService
      }
    })()
  ]
})
export class LocationModule {}
