import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { format } from 'date-fns';

import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';

define(InterpreterEntity, (faker: typeof Faker, settings) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const phone = faker.phone.phoneNumber();

  const interpreter = new InterpreterEntity();
  interpreter.firstName = firstName;
  interpreter.lastName = lastName;
  interpreter.email = email;
  interpreter.phone = phone;
  interpreter.address = faker.address.streetAddress();
  interpreter.city = faker.random.arrayElement(['Victoria', 'Vancouver', 'Nanaimo']);
  interpreter.province = 'BC';
  interpreter.postal = faker.address.zipCode();
  interpreter.homePhone = faker.phone.phoneNumber();
  interpreter.businessPhone = faker.phone.phoneNumber();
  interpreter.supplier = '1234567';
  interpreter.gst = '123456789-RT0001';
  interpreter.comments = faker.lorem.sentence();
  interpreter.contractExtension = faker.random.boolean();
  interpreter.contractTermination = faker.random.boolean();

  if (faker.random.boolean()) {
    const date = faker.date.past();
    interpreter.criminalRecordCheck = format(date, 'dd-MMM-yyyy');
    interpreter.criminalRecordCheckDate = date;
  } else {
    if (faker.random.boolean()) {
      interpreter.criminalRecordCheck = 'MNS';
    } else {
      const date = faker.date.past();
      interpreter.criminalRecordCheck = format(date, 'dd-MMM-yy');
    }
  }

  return interpreter;
});
