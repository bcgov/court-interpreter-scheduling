import { ApiProperty } from '@nestjs/swagger';
import { LocationRO } from 'src/location/ro/location.ro';

export class UserRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  kcId: string;

  @ApiProperty()
  guId: string;

  @ApiProperty()
  location: LocationRO;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
