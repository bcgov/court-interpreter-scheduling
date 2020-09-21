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
    return random;
  }

  interpreters(n: number): Interpreter[] {
    let random: Interpreter[] = [];
    for (let i = 0; i < n; i++) {
      const id: string = '' + i;
      const name: string = faker.name.findName();
      const phone: string = faker.phone.phoneNumber();
      const email: string = faker.internet.email();
      const level: number = faker.random.number(4);
      const bookings: number = faker.random.number(15);
      random.push(new Interpreter(id, name, level, phone, email, bookings));
    }
    return random;
  }
}
