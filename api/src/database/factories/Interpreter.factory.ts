import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';

define(InterpreterEntity, (faker: typeof Faker, settings) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const name = `${firstName} ${lastName}`;

  const email = faker.internet.email(firstName, lastName);
  const level = faker.random.number({
    min: 1,
    max: 4,
  });
  const phone = faker.phone.phoneNumber();
  const distance = faker.random.number({ min: 1, max: 10, precision: 0.01 });

  const interpreter = new InterpreterEntity();
  interpreter.name = name;
  interpreter.email = email;
  interpreter.level = level;
  interpreter.phone = phone;
  interpreter.distance = distance;

  return interpreter;
});
