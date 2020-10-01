import { Booking } from './models/booking'
import { Court } from './models/court'
import { Interpreter } from './models/interpreter'
import { Language } from './models/language'
import * as faker from 'faker'

export default class DataService {

  languages: Language[] = [
    { id: `farsi`, name: `Farsi` },
    { id: `cree`, name: `Cree` },
    { id: `french`, name: `French` },
    { id: `italian`, name: `Italian` }
  ];

  courts: Court[] = [
    { id: `victoria`, name: `Victoria` },
    { id: `vancouver`, name: `Vancouver` },
    { id: `abbotsford`, name: `Abbotsford` },
    { id: `nanaimo`, name: `Nanaimo` }
  ];

  constructor() { }

  public static bookings(n: number): Booking[] {
    let random: Booking[] = [];
    for (let i = 0; i < n; i++) {
      const id: string = '' + i;
      const date: Date = faker.date.future();
      const interpreterId: string = '' + i;
      const interpreterName: string = faker.name.findName();
      const file: string = faker.random.alphaNumeric(6);
      const language: string = faker.lorem.word(1);
      const caseName: string = faker.lorem.sentence(4);
      const comments: string = faker.lorem.sentence(6);
      const isBooked: boolean = faker.random.boolean();
      random.push(new Booking(id, date, interpreterId, interpreterName, file, language, caseName, comments, isBooked));
    }
    return random;
  }

  public static interpreters(n: number): Interpreter[] {
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
