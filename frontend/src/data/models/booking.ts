export class Booking {
  id: string;
  date: Date;
  interpreterId: string;
  interpreterName: string;
  courtFileNumber: string;
  caseName: string;
  comments: string;
  isBooked: boolean;

  constructor(id: string, date: Date, interpreterId: string,
    interpreterName: string, courtFileNumber: string, caseName: string,
    comments: string, isBooked: boolean) {
    this.id = id;
    this.date = date;
    this.interpreterId = interpreterId;
    this.interpreterName = interpreterName;
    this.courtFileNumber = courtFileNumber;
    this.caseName = caseName;
    this.comments = comments;
    this.isBooked = isBooked;
  }
}
