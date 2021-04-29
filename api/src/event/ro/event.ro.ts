import { ApiProperty } from '@nestjs/swagger';

export class EventRO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  previous: string;

  @ApiProperty()
  updated: string;
  
  @ApiProperty()
  user?: string;

  @ApiProperty()
  createdAt: Date;

}
