import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, WhereExpression } from 'typeorm';

import { DistanceEntity } from './entities/distance.entity';
import { googleMapMock } from './mock/googleMapApi.mock';

@Injectable()
export class DistanceService {
  constructor(@InjectRepository(DistanceEntity) private readonly distanceRepository: Repository<DistanceEntity>) {}

  async generate({
    courtAddrs,
    intpAddrs,
  }: {
    courtAddrs: { address: string }[];
    intpAddrs: { address: string }[];
  }): Promise<DistanceEntity[]> {
    // exists data

    const newInserts: DistanceEntity[][] = await Promise.all(
      intpAddrs.map(async ({ address: intpAddr }) => {
        return await Promise.all(
          courtAddrs.map(async ({ address: courtAddr }) => {
            if (!this.isDistanceExist({ courtAddr, intpAddr })) {
              const distance = await this.calcDistance(courtAddr, intpAddr);
              const disEntity: DistanceEntity = this.distanceRepository.create({ courtAddr, intpAddr, distance });
              return await this.distanceRepository.save(disEntity);
            }
          }),
        );
      }),
    );

    // flat array
    return [].concat(...newInserts);
  }

  private async calcDistance(addr1: string, addr2: string): Promise<string> {
    // In non-production env, using mock google api
    if (process.env.DEPLOYMENT_ENV !== 'prod') {
      return googleMapMock(addr1, addr2);
    }

    // google api
    return String(200.123);
  }

  private isDistanceExist({ courtAddr, intpAddr }: { courtAddr: string; intpAddr: string }): boolean {
    return false;
  }
}
