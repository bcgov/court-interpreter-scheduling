import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveLocationDTO {
  @ApiProperty({
    description: 'Location ID',
  })
  @IsNotEmpty()
  locationId: number;
}
