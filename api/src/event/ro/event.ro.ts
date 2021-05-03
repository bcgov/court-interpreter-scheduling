import { ApiProperty } from '@nestjs/swagger';

export class EventRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  field: string;

  @ApiProperty()
  previous: string;

  @ApiProperty()
  updated: string;

  @ApiProperty()
  user?: string;

  @ApiProperty()
  createdAt: Date;
}
