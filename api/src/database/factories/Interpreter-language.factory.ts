import { define, factory } from 'typeorm-seeding';
import * as Faker from 'faker';

import { InterpreterLanguageEntity } from 'src/interpreter/entities/interpreter-language.entity';

define(InterpreterLanguageEntity, (faker: typeof Faker, settings) => {
  const languageName = faker.random.arrayElement([
    'English',
    'French',
    'Portuguese',
    'Chinese',
    'Japanese',
  ]);

  const level = faker.random.arrayElement([1, 2, 3, 4]);

  const intLang = new InterpreterLanguageEntity();
  intLang.language = {
    name: languageName,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
  intLang.level = level;
  intLang.commentOnLevel = faker.lorem.sentence();

  return intLang;
});
