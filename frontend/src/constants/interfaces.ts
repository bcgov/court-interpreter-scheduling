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
  language: string;
  level: string[];
  city: string;
}

export enum Level {
  one = 1,
  two,
  three,
  four,
}

export type Language = {
  id: number;
  language: {
    name: string;
    created_at?: Date;
    updated_at?: Date;
  };
  level: Level;
  commentOnLevel: string;
  created_at?: Date;
  updated_at?: Date;
}
