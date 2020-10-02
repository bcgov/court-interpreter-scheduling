export enum BookingPeriod {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  WHOLE_DAY = 'WHOLE_DAY',
}

export type BookingDate = {
  date: Date;
  period?: BookingPeriod;
  arrivalTime?: Date;
}

export type SearchParams = {
  language: string;
  level: string[];
  city: string;
  dates: Array<BookingDate>
}
