import { Controller, Get } from '@nestjs/common';
import { InterpreterService } from 'src/interpreter/interpreter.service';
import { LocationService } from 'src/location/location.service';
import { DistanceService } from './distance.service';

@Controller('distance')
export class DistanceController {
  constructor(
    private readonly interpreterService: InterpreterService,
    private readonly locationService: LocationService,
    private readonly distanceService: DistanceService,
  ) {}

  @Get('/generate')
  async generateDistance() {
    const courtAddrs = await this.locationService.findAllAddress();
    const intpAddrs = await this.interpreterService.findAllAddress();
    return await this.distanceService.generate({ courtAddrs, intpAddrs });
  }
}
