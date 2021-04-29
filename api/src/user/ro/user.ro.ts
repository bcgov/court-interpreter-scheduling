import { ApiProperty } from '@nestjs/swagger';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { LocationRO } from 'src/location/ro/location.ro';

export class UserRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  location: LocationRO;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
