import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(LocationEntity) private readonly locationRepository: Repository<LocationEntity>) {}
  async findAll(): Promise<LocationEntity[]> {
    return this.locationRepository.find({ order: { name: 'ASC' } });
  }

  async findAllAddress(): Promise<{ address: string }[]> {
    return this.locationRepository.query(`
      SELECT DISTINCT(CONCAT(address_line1)) address 
      FROM "court_location"
      WHERE address_line1 IS NOT NULL
    `);
  }
}
