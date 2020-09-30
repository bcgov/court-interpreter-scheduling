import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as faker from 'faker/locale/en_CA';

import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { InterpreterLanguageEntity } from 'src/interpreter/entities/interpreter-language.entity';
import { BookingEntity } from 'src/booking/entities/booking.entity';

export default class CreateBooking implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const languageName = faker.random.arrayElement([
      'French',
      'Portuguese',
      'Chinese',
      'Japanese',
    ]);

    const languageName2 = faker.random.arrayElement([
      'French',
      'Portuguese',
      'Chinese',
      'Japanese',
    ]);

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

    const generateInterpreter = async (id: number) =>
      await connection
        .createQueryBuilder()
        .select('int')
        .from(InterpreterEntity, 'int')
        .where('int.id = :id', { id })
        .getOne();

    await factory(BookingEntity)()
      .map(async booking => {
        booking.language = Math.random() > 0.5 ? LangEntity : LangEntity2;
        booking.interpreter = await generateInterpreter(1);
        return booking;
      })
      .createMany(2);

    await factory(BookingEntity)()
      .map(async booking => {
        booking.language = Math.random() > 0.5 ? LangEntity : LangEntity2;
        booking.interpreter = await generateInterpreter(2);
        return booking;
      })
      .createMany(2);

    await factory(BookingEntity)()
      .map(async booking => {
        booking.language = Math.random() > 0.5 ? LangEntity : LangEntity2;
        booking.interpreter = await generateInterpreter(3);
        return booking;
      })
      .createMany(2);
  }
}
