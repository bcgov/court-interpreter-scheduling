import { define } from 'typeorm-seeding';
import * as Faker from 'faker';

import { BookingEntity } from 'src/booking/entities/booking.entity';
import { BookingPeriod } from 'src/booking/enums/booking-period.enum';
import { BookingStatus } from 'src/booking/enums/booking-status.enum';
import { BookingDateEntity } from 'src/booking/entities/booking-date.entity';

define(BookingEntity, (faker: typeof Faker, settings) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const booking = new BookingEntity();
  booking.caseName = faker.lorem.slug();
  booking.room = '203';
  booking.status = faker.random.arrayElement([
    BookingStatus.PENDING,
    BookingStatus.BOOKED,
  ]);
  booking.registry = faker.lorem.slug();
  booking.file = faker.lorem.slug();
  booking.interpretFor = firstName;
  booking.requestedBy = lastName;
  booking.reason = faker.lorem.sentence();
  booking.prosecutor = firstName;
  booking.comment = faker.lorem.sentence();

  return booking;
});
