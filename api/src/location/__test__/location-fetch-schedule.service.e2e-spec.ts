import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleModule } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tearDownDatabase } from 'typeorm-seeding';
import { LocationEntity } from '../entities/location.entity';

import { activeLocationList, LocationFetchScheduleService } from '../location-fetch-schedule.service';
import { SSCourtLocation } from '../jc-interface-location-api';

dotenv.config();

jest.setTimeout(50000);
describe('LocationFetchScheduleService e2e tests', () => {
  let subject: LocationFetchScheduleService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10) || 5435,
          username: process.env.POSTGRESQL_USER,
          password: process.env.POSTGRESQL_PASSWORD,
          database: process.env.DB_TEST_DATABASE,
          entities: ['./**/*.entity.ts'],
          synchronize: true,
          logging: ['error'],
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([LocationEntity]),
      ],
      providers: [LocationFetchScheduleService],
    }).compile();
    await module.init();
    subject = module.get<LocationFetchScheduleService>(LocationFetchScheduleService);
  });

  afterAll(async () => {
    subject.stopJob();
    await tearDownDatabase();
  });

  it('should be defined', () => {
    expect(subject).toBeDefined();
  });

  it('should load active location list', async () => {
    const list = await activeLocationList();
    expect(list).toBeDefined();
    expect(list.length).toBeGreaterThan(0);
  });

  it('should fetch location info using mapbox', async () => {
    const location: SSCourtLocation = {
      codeType: 'COURT_LOCATIONS',
      code: '22.0001',
      shortDesc: '4671',
      longDesc: 'Ashcroft Provincial Court',
      flex: 'Y',
      additionalProperties: {},
    };
    const result = await subject.fetchCoordinate(location);
    expect(result).toBeDefined();
  });

  it('should fetch and save location', async () => {
    const entities: LocationEntity[] = await subject.fetchAndStoreLocation();
    expect(entities.length).toBeGreaterThan(0);
  });
});
