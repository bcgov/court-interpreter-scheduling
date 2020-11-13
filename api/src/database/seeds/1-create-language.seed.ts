import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { LanguageEntity } from '../../language/entities/language.entity';

export default class CreateLanguage implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(LanguageEntity)
      .values([
        { name: 'English' },
        { name: 'French' },
        { name: 'Portuguese' },
        { name: 'Chinese' },
        { name: 'Japanese' },
      ])
      .execute();
  }
}
