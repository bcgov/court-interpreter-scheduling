import { Language } from './language';

export class Interpreter {
    id: string;
    name: string;
    language: string;
    level: number;
    phone: string;
    email: string;
    bookingsInTheLastDays: number;

    constructor(
        id: string,
        name: string,
        language: string,
        level: number,
        phone: string,
        email: string,
        bookingsInTheLastDays: number) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.phone = phone;
        this.email = email;
        this.language = language;
        this.bookingsInTheLastDays = bookingsInTheLastDays;
    }
}
