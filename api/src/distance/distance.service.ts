import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterpreterRO } from 'src/interpreter/ro/interpreter.ro';
import { Repository } from 'typeorm';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

import { DistanceEntity } from './entities/distance.entity';
import { fetchGoogleMapDistance } from './googleMap';
import { googleMapMock } from './mock/googleMapApi.mock';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { mapAndJoin } from 'src/utils';

@Injectable()
export class DistanceService {
  constructor(
    @InjectRepository(DistanceEntity) private readonly distanceRepository: Repository<DistanceEntity>,
    @InjectPinoLogger(DistanceService.name) private readonly logger: PinoLogger,
  ) {}

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
            const data = await this.distanceRepository.save(disEntity);
            this.logger.info(`Generate Distance data: ${data}`);
          }
        }
      });
    });
  }

  private async calcDistance(addr1: string, addr2: string): Promise<string | null> {
    //In non-production env, using mock google api
    if (process.env.DEPLOYMENT_ENV !== 'prod') {
      this.logger.info('mocking distance');
      return googleMapMock();
    }

    // google api
    const googleDistance = await fetchGoogleMapDistance(addr1, addr2);
    this.logger.info(`Intp address: ${addr1} - Court address: ${addr2} : Distance: ${googleDistance}`);
    return googleDistance;
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
    this.logger.info(`Start: Batch Insert to "distance": ${data}`);
    this.distanceRepository
      .createQueryBuilder()
      .insert()
      .values(data)
      .execute()
      .then(res => this.logger.info(`Complete: Batch Insert to "distance": ${res}`));
  }

  async addDistanceToInterpreters(
    interpreters: InterpreterRO[],
    courtAddr: string,
    distanceLimit?: boolean,
  ): Promise<InterpreterRO[]> {
    const DISTANCE_LIMIT = 32;
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
      intpWithDistance = intpWithDistance.filter(intp => intp.distance <= DISTANCE_LIMIT);
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
    this.logger.info('Empty Table "distance"');
  }

  async findDistanceByBooking(
    booking: BookingEntity,
  ): Promise<DistanceEntity> {
    const { interpreter, location } = booking;
    const courtAddr = location.addressLine1;
    const { address, city, province, postal } = interpreter;
    const intpAddr = `${mapAndJoin([address, city, province], ', ')} ${postal}`;
    return this.distanceRepository.findOne({ intpAddr, courtAddr });
  }
}
