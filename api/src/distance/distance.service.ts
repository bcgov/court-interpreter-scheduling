import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, WhereExpression } from 'typeorm';

import { DistanceEntity } from './entities/distance.entity';

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

    intpAddrs.forEach(({ address: intpAddr }) => {
      courtAddrs.forEach(async ({ address: courtAddr }) => {
        if (!this.isDistanceExist({ courtAddr, intpAddr })) {
          const distance = await this.calcDistance(courtAddr, intpAddr);
          const disEntity: DistanceEntity = this.distanceRepository.create({ courtAddr, intpAddr, distance });
          console.log(disEntity);
          await this.distanceRepository.save(disEntity);
        }
      });
    });

    const distances = await this.distanceRepository.find();
    return distances;
  }

  private async calcDistance(addr1: string, addr2: string): Promise<string> {
    if (process.env.DEPLOYMENT_ENV !== 'prod') {
      return String(100);
    }
    return String(200.123);
    // google api
  }

  private isDistanceExist({ courtAddr, intpAddr }: { courtAddr: string; intpAddr: string }): boolean {
    return false;
  }
}
