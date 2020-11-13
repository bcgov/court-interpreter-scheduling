import { Injectable } from '@nestjs/common';
import { Location } from './enums/location.enum';

@Injectable()
export class LocationService {
  findAll(): Location[] {
    return Object.values(Location);
  }
}
