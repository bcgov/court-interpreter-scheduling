import { Injectable } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Court } from 'src/app/models/court';
import { Interpreter } from 'src/app/models/interpreter';
import { Language } from 'src/app/models/language';
import * as faker from 'faker';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  interpreters: Interpreter[] = [
    {
      id: '1',
      name: 'Ella Beck',
      level: '2',
      phone: '+1604.333.4567',
      emailAddress: 'ella_beck@cameron.net',
      bookingsInTheLastDays: '5'
    }, {
      id: '2',
      name: 'Ella Beck',
      level: '2',
      phone: '+1604.333.4567',
      emailAddress: 'ella_beck@cameron.net',
      bookingsInTheLastDays: '2'
    }, {
      id: '3',
      name: 'Ella Beck',
      level: '2',
      phone: '+1604.333.4567',
      emailAddress: 'ella_beck@cameron.net',
      bookingsInTheLastDays: '1'
    }, {
      id: '4',
      name: 'Ella Beck',
      level: '2',
      phone: '+1604.333.4567',
      emailAddress: 'ella_beck@cameron.net',
      bookingsInTheLastDays: '0'
    }, {
      id: '5',
      name: 'Ella Beck',
      level: '2',
      phone: '+1604.333.4567',
      emailAddress: 'ella_beck@cameron.net',
      bookingsInTheLastDays: '12'
    }, {
      id: '6',
      name: 'Ella Beck',
      level: '2',
      phone: '+1604.333.4567',
      emailAddress: 'ella_beck@cameron.net',
      bookingsInTheLastDays: '3'
    },
  ];

  languages: Language[] = [
    { id: `farsi`, name: `Farsi` },
    { id: `french`, name: `French` },
    { id: `italian`, name: `Italian` }
  ];

  courts: Court[] = [
    { id: `victoria`, name: `Victoria` },
    { id: `vancouver`, name: `Vancouver` },
    { id: `nanaimo`, name: `Nanaimo` }
  ];

  constructor() { }

  bookings(n: number): Booking[] {
    let random: Booking[] = [];
    console.log('generating...');
    for (let i = 0; i < n; i++) {
      const id: string = '' + i;
      const date: Date = faker.date.future();
      const interpreterId: string = '' + i;
      const interpreterName: string = faker.name.findName();
      const courtFileNumber: string = faker.random.alphaNumeric(11);
      const caseName: string = faker.lorem.sentence();
      const comments: string = faker.lorem.sentences();
      const isBooked: boolean = faker.random.boolean();
      random.push(new Booking(id, date, interpreterId, interpreterName, courtFileNumber, caseName, comments, isBooked));
    }
    console.log('generated');
    return random;
  }
}
