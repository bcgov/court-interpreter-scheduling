import { define, factory } from 'typeorm-seeding';
import * as Faker from 'faker';

import { InterpreterLanguageEntity } from 'src/interpreter/entities/interpreter-language.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';

define(InterpreterLanguageEntity, (faker: typeof Faker, settings) => {
  const languageName = faker.random.arrayElement([
    'English',
    'French',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Asl'
  ]);

  const level = faker.random.arrayElement([1, 2, 3, 4]);

  const intLang = new InterpreterLanguageEntity();
  const language = new LanguageEntity();
  language.name = languageName;
  intLang.language = language;
  intLang.level = level;
  intLang.commentOnLevel = faker.lorem.sentence();

  return intLang;
});
