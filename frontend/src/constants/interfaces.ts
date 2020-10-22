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

export type InterpreterSearchParams = {
  name: string;
  city: string;
  keywords: string;
  language: string;
  level: string[];
}

export enum Level {
  one = 1,
  two,
  three,
  four,
}

export type Language = {
  languageName: string;
  level: Level;
  commentOnLevel: string;
  created_at?: Date;
  updated_at?: Date;
}
