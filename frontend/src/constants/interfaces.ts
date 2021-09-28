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
  methodOfAppearance?: string;
  location: Location;
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

export const BookingStatusColor = {
  [BookingStatus.PENDING]:  '#FCBA19',
  [BookingStatus.CANCELLED]: '#FF8686',
  [BookingStatus.BOOKED]: '#58CB7D',
}


export type BookingDate = {
  date: Date;
  period?: BookingPeriod;
  arrivalTime?: Date;
};

export interface Location {
  id: number;
  name: string;
  locationCode: string;
  addressLine1: string;
  city: string;
  postalCode: string;
}

export type SearchParams = {
  language: string;
  level: string[];
  location: Location | null;
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

export type BookingSearchParams = {
  dates?: Array<BookingDate>;
  interpreter?: string;
  file?: string;
  locationId?: number;
}

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
  distance?: number;
  conflicts?: Conflict[];
}

export interface UserResponse {
  id: string;
  location: Location;
}

export interface Event {
  field: string;
  subfield?: string;
  language?: string;
  previous: string;
  updated: string;
  createdAt: Date;
}

export interface BookingEvent extends Event {
  user: string;
}

export interface Conflict {
  file: string;
  location: string;
}
