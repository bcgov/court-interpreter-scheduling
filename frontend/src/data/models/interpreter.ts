import { Language } from './language';

export class Interpreter {
  id: string;
  name: string;
  level: number;
  phone: string;
  emailAddress: string;
  bookingsInTheLastDays: number;

  constructor(id: string, name: string, level: number, phone: string, emailAddress: string, bookingsInTheLastDays: number) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.phone = phone;
    this.emailAddress = emailAddress;
    this.bookingsInTheLastDays = bookingsInTheLastDays;
  }
}
