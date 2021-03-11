import { ApiProperty } from '@nestjs/swagger';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { LanguageRO } from './interpreter-language.ro';

export class InterpreterRO {

  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  languages: Array<LanguageRO>;

  @ApiProperty()
  bookings: Array<BookingEntity>;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  postal: string;

  @ApiProperty()
  homePhone: string;

  @ApiProperty()
  businessPhone: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  supplier: string;

  @ApiProperty()
  gst: string;

  @ApiProperty()
  criminalRecordCheck: string;

  @ApiProperty()
  criminalRecordCheckDate: Date;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  contractExtension: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

}
