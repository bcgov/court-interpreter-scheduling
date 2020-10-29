import { BookingPeriod } from '../enums/booking-period.enum';

export class BookingDateRO {
  id: number;
  date: Date;
  period: BookingPeriod;
  arrivalTime: string;
}
