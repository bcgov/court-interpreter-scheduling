export type BookingBase = {
  room: string;
  registry: string;
  file: string;
  interpretFor: string;
  caseName: string;
  requestedBy: string;
  federal: boolean | undefined;
  reason: string;
  prosecutor: string;
  comment: string;
  locationName: string;
};

export interface BookingCreate extends BookingBase {
  language: string;
}

export interface Booking extends BookingBase {
  id: number;
  language: string;
  dates: BookingDate[];
  interpreter: Interpreter;
  status: BookingStatus;
}

export enum BookingPeriod {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  WHOLE_DAY = 'WHOLE_DAY',
}

export enum BookingStatus {
  PENDING = 'Pending',
  BOOKED = 'Booked',
  CANCELLED = 'Cancelled',
}

export type BookingDate = {
  date: Date;
  period?: BookingPeriod;
  arrivalTime?: Date;
};

export type SearchParams = {
  language: string;
  level: string[];
  city: string;
  dates: Array<BookingDate>;
};

export type InterpreterSearchParams = {
  name: string;
  city: string;
  keywords: string;
  language: string;
  level: string[];
  active?: boolean;
  criminalRecordCheck?: Date;
};

export enum Level {
  one = 1,
  two,
  three,
  four,
}

export type LanguageBase = {
  languageName: string;
  commentOnLevel: string;
};

export interface Language extends LanguageBase {
  level: Level;
  created_at?: Date;
  updated_at?: Date;
}

export interface LanguageCreate extends LanguageBase {
  level: string;
}

export type InterpreterBase = {
  id?: string | number;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  province?: string;
  postal?: string;
  homePhone?: string;
  businessPhone?: string;
  phone?: string;
  email?: string;
  supplier?: string;
  gst?: string;
  comments?: string;
  contractExtension?: boolean; // Right now this flag means "Active"
  contractTermination?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  criminalRecordCheck?: string; // Legacy comment object
  criminalRecordCheckDate?: Date; // TODO: Currently Material TextField type=date returns date string not date object, so keeping as string here, In future use material date picker
  adminComments?: string;
};

export interface InterpreterCreate extends InterpreterBase {
  languages: LanguageCreate[];
}

export interface Interpreter extends InterpreterBase {
  languages: Language[];
  bookings: Booking[];
}
