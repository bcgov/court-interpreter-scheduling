import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { LocationEntity } from '../../location/entities/location.entity';

export default class CreateCourtLocation implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(LocationEntity)
      .values([
        {
          name: 'Campbell River Law Courts',
          locationCode: '1031',
          addressLine1: '500 13th Ave.',
          city: 'Campbell River',
          postalCode: 'V9W6P1',
        },
        {
          name: 'Courtenay Law Courts',
          locationCode: '1041',
          addressLine1: '420 Cumberland Road',
          city: 'Courtenay',
          postalCode: 'V9N 2C4',
        },
      ])
      .execute();
  }
}
