import * as path from 'path';
import * as fs from 'fs';
import * as csvtojson from 'csvtojson';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './entities/location.entity';

import { fetchCourtLocations, SSCourtLocation } from './jc-interface-location-api';

const mbxGeoCode = require('@mapbox/mapbox-sdk/services/geocoding');

export interface ActiveLocationListCSVRow {
  CSB_REGION_CD?: string;
  CSB_REGION_DSC?: string;
  AGEN_AGENCY_IDENTIFIER_CD?: string;
  AGEN_AGENCY_NM?: string;
  AGEN_ADDRESS_LINE_1_TXT?: string;
  AGEN_ADDRESS_LINE_2_TXT?: string;
  AGEN_POSTAL_CODE_TXT?: string;
  CITY_LONG_NM?: string;
}

export const activeLocationList = async () => {
  const filePath = path.resolve(__dirname, '../../activeList.csv');
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const list: ActiveLocationListCSVRow[] = await csvtojson({ noheader: false }).fromString(content);
  return list;
};

export interface GeographyFeature {
  geometry: { coordinates: number[] };
  place_name: string;
}

@Injectable()
export class LocationFetchScheduleService {
  static JOB_NAME = 'location-fetch-schedular';
  private readonly geoCodeService = mbxGeoCode({ accessToken: process.env.MAP_BOX_TOKEN });

  private readonly logger = new Logger(LocationFetchScheduleService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(LocationEntity) private readonly repo: Repository<LocationEntity>,
  ) {}

  public async fetchAndStoreLocation(): Promise<LocationEntity[]> {
    const allLocation: SSCourtLocation[] = await fetchCourtLocations();
    const activeLocations = await activeLocationList();
    const filtered: SSCourtLocation[] = allLocation.filter((loc: SSCourtLocation) => {
      return activeLocations.filter(item => item.AGEN_AGENCY_IDENTIFIER_CD === loc.shortDesc).length > 0;
    });
    const entities: LocationEntity[] = [];
    for (const location of filtered) {
      entities.push(await this.handleLocation(location));
    }
    return entities;
  }

  private async activeLocationInfo(location: SSCourtLocation): Promise<ActiveLocationListCSVRow> {
    const activeLocations = await activeLocationList();
    const filtered = activeLocations.filter(item => item.AGEN_AGENCY_IDENTIFIER_CD === location.shortDesc);
    return filtered.length > 0 ? filtered[0] : undefined;
  }

  async handleLocation(location: SSCourtLocation) {
    // Check database
    let locationEntity: LocationEntity;
    locationEntity = await this.repo.findOne({
      locationCode: location.code,
      shortDescription: location.shortDesc,
    });
    if (!locationEntity) {
      locationEntity = this.repo.create();
      const feature: GeographyFeature = await this.fetchCoordinate(location);
      locationEntity.name = location.longDesc;
      locationEntity.shortDescription = location.shortDesc;
      locationEntity.locationCode = location.code;
      if (feature) {
        locationEntity.latitude = feature.geometry.coordinates[1];
        locationEntity.longitude = feature.geometry.coordinates[0];
        locationEntity.addressLine1 = feature.place_name;
      } else {
        this.logger.warn(`No location  detail for [${location.longDesc}]`);
        console.log(`No location  detail for [${location.longDesc}]`);
        const info = await this.activeLocationInfo(location);
        if (info) {
          locationEntity.addressLine1 = `${info.AGEN_ADDRESS_LINE_1_TXT} ${info.AGEN_POSTAL_CODE_TXT}`;
          locationEntity.postalCode = info.AGEN_POSTAL_CODE_TXT;
        }
      }
      await this.repo.save(locationEntity);
    } else if (!locationEntity.latitude || !locationEntity.longitude) {
      // No location data
      // Try to fetch it again
      const tempLocation: SSCourtLocation = {
        code: locationEntity.locationCode,
        longDesc: locationEntity.addressLine1,
        shortDesc: locationEntity.shortDescription,
        flex: '',
        additionalProperties: {},
        codeType: '',
      };
      const feature = await this.fetchCoordinate(tempLocation);
      if (feature) {
        locationEntity.addressLine2 = locationEntity.addressLine1;
        locationEntity.addressLine2 = feature.place_name;
        locationEntity.longitude = feature.geometry.coordinates[0];
        locationEntity.latitude = feature.geometry.coordinates[1];
        await this.repo.save(locationEntity);
      }
    }
    return locationEntity;
  }

  async fetchCoordinate(location: SSCourtLocation): Promise<GeographyFeature> {
    const resp = await this.geoCodeService
      .forwardGeocode({
        query: location.longDesc,
        countries: ['ca'],
        limit: 1,
        mode: 'mapbox.places',
      })
      .send();
    const match: any = resp.body;
    return match.features[0] as GeographyFeature;
  }

  @Cron('0 0 1 * * 7', {
    name: LocationFetchScheduleService.JOB_NAME,
  })
  async handleCron() {
    this.logger.log('Will update court locations');
    await this.fetchAndStoreLocation();
    this.logger.log('Did update court locations');
  }

  stopJob() {
    this.schedulerRegistry.getCronJob(LocationFetchScheduleService.JOB_NAME)?.stop();
  }
}
