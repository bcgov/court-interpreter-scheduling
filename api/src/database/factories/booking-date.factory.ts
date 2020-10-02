import { define, factory } from 'typeorm-seeding';
import * as Faker from 'faker';

import { BookingDateEntity } from 'src/booking/entities/booking-date.entity';
import { BookingPeriod } from 'src/booking/enums/booking-period.enum';

define(BookingDateEntity, (faker: typeof Faker, settings) => {
  const dates = new BookingDateEntity();
  dates.date = Math.random() > 0.5 ? faker.date.recent() : faker.date.past();
  dates.period = faker.random.arrayElement([
    BookingPeriod.MORNING,
    BookingPeriod.AFTERNOON,
    BookingPeriod.WHOLE_DAY,
  ]);
  dates.arrivalTime = faker.random.arrayElement(['10:00', '12:00', '13:00']);
  return dates;
});
