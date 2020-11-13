import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker/locale/en_CA';

import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { InterpreterLanguageEntity } from 'src/interpreter/entities/interpreter-language.entity';

export default class CreateInterpreter implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const languageName = faker.random.arrayElement(['French', 'Portuguese']);
    const languageName2 = faker.random.arrayElement(['Chinese']);
    const languageName3 = faker.random.arrayElement(['Japanese']);

    const LangEntity = await connection
      .createQueryBuilder()
      .select('lang')
      .from(LanguageEntity, 'lang')
      .where('lang.name = :name', { name: languageName })
      .getOne();

    const LangEntity2 = await connection
      .createQueryBuilder()
      .select('lang')
      .from(LanguageEntity, 'lang')
      .where('lang.name = :name', { name: languageName2 })
      .getOne();

    const LangEntity3 = await connection
      .createQueryBuilder()
      .select('lang')
      .from(LanguageEntity, 'lang')
      .where('lang.name = :name', { name: languageName3 })
      .getOne();

    const gIntLang = async () => {
      return await factory(InterpreterLanguageEntity)().createMany(1, {
        language:
          Math.random() > 0.66
            ? LangEntity
            : Math.random() > 0.33
            ? LangEntity2
            : LangEntity3,
      });
    };

    await factory(InterpreterEntity)()
      .map(async interpreter => {
        interpreter.languages = [
          ...(await factory(InterpreterLanguageEntity)().createMany(1, {
            language: LangEntity,
          })),
          ...(await factory(InterpreterLanguageEntity)().createMany(1, {
            language: LangEntity2,
          })),
        ];
        return interpreter;
      })
      .createMany(1);

    await factory(InterpreterEntity)()
      .map(async interpreter => {
        interpreter.languages = await gIntLang();
        return interpreter;
      })
      .createMany(16);
  }
}
