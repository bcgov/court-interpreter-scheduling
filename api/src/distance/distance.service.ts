import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterpreterRO } from 'src/interpreter/ro/interpreter.ro';
import { Repository } from 'typeorm';

import { DistanceEntity } from './entities/distance.entity';
import { fetchGoogleMapDistance } from './googleMap';
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
  }): Promise<void> {
    // exists data
    const originDistances = await this.distanceRepository.find();

    intpAddrs.map(async ({ address: intpAddr }) => {
      courtAddrs.map(async ({ address: courtAddr }) => {
        if (!this.isDistanceExist({ courtAddr, intpAddr, distanceData: originDistances })) {
          const distance = await this.calcDistance(courtAddr, intpAddr);
          if (distance) {
            const disEntity: DistanceEntity = this.distanceRepository.create({ courtAddr, intpAddr, distance });
            this.distanceRepository.save(disEntity);
          }
        }
      });
    });
  }

  private async calcDistance(addr1: string, addr2: string): Promise<string | null> {
    //In non-production env, using mock google api
    if (process.env.DEPLOYMENT_ENV !== 'prod') {
      return googleMapMock();
    }

    // google api
    return await fetchGoogleMapDistance(addr1, addr2);
  }

  private isDistanceExist({
    courtAddr,
    intpAddr,
    distanceData,
  }: {
    courtAddr: string;
    intpAddr: string;
    distanceData: DistanceEntity[];
  }): boolean {
    return !!distanceData.find(
      distance => distance.intpAddr === intpAddr && distance.courtAddr === courtAddr && !!distance.distance,
    );
  }

  async createMany(
    data: {
      courtAddr: string;
      intpAddr: string;
      distance: string;
    }[],
  ) {
    this.distanceRepository
      .createQueryBuilder()
      .insert()
      .values(data)
      .execute();
  }

  async addDistanceToInterpreters(
    interpreters: InterpreterRO[],
    courtAddr: string,
    distanceLimit?: number,
  ): Promise<InterpreterRO[]> {
    let intpWithDistance = await Promise.all(
      interpreters.map(async intp => {
        const newIntp = { ...intp };
        const distance = await this.distanceRepository.findOne({ intpAddr: intp.intpAddr, courtAddr });
        if (distance) {
          newIntp.distance = Number(distance.distance);
        } else {
          newIntp.distance = null;
        }
        return newIntp;
      }),
    );

    if (distanceLimit) {
      intpWithDistance = intpWithDistance.filter(intp => intp.distance <= distanceLimit);
    }

    return intpWithDistance.sort(
      (a, b) => (a.distance != null ? a.distance : Infinity) - (b.distance != null ? b.distance : Infinity),
    );
  }

  /**
   * empty table
   */
  async emptyTable(): Promise<void> {
    await this.distanceRepository.query(`DELETE FROM distance;`);
  }
}
