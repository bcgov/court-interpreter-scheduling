export class Booking {
  id: string;
  date: Date;
  interpreterId: string;
  interpreterName: string;
  file: string;
  language: string;
  caseName: string;
  comments: string;
  isBooked: boolean;

  constructor(
    id: string,
    date: Date,
    interpreterId: string,
    interpreterName: string,
    file: string,
    language: string,
    caseName: string,
    comments: string,
    isBooked: boolean,
  ) {
    this.id = id;
    this.date = date;
    this.interpreterId = interpreterId;
    this.interpreterName = interpreterName;
    this.file = file;
    this.language = language;
    this.caseName = caseName;
    this.comments = comments;
    this.isBooked = isBooked;
  }
}
