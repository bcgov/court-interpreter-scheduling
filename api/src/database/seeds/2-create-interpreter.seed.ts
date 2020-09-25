import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker/locale/en_CA';

import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';

export default class CreateInterpreter implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const English = await connection
      .createQueryBuilder()
      .select('lang')
      .from(LanguageEntity, 'lang')
      .where('lang.name = :name', { name: 'English' })
      .getOne();

    const French = await connection
      .createQueryBuilder()
      .select('lang')
      .from(LanguageEntity, 'lang')
      .where('lang.name = :name', { name: 'French' })
      .getOne();

    const generate = async (num: number, prop: object) => {
      return await factory(InterpreterEntity)().createMany(num, prop);
    };

    await connection
      .createQueryBuilder()
      .insert()
      .into(InterpreterEntity)
      .values([
        ...(await generate(8, {
          language: English,
        })),
        ...(await generate(8, {
          language: French,
        })),
      ])
      .execute();
  }
}
