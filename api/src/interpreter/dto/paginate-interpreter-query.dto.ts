import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import * as faker from 'faker/locale/en_CA';
import { BookingDateDto } from 'src/booking/dto/booking-date.dto';
import { BookingPeriod } from 'src/booking/enums/booking-period.enum';

import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { Level } from '../enums/level.enum';

export class PaginateInterpreterQueryDto extends PaginationQueryDTO {
  @ApiProperty({
    description: `
      Multiple interpreter level from 1 to 4,
      Like: level[]=2&level[]=3
    `,
    example: Level.one,
    enum: [1, 2, 3, 4],
  })
  @IsOptional()
  level?: [1, 2, 3, 4][];

  @ApiProperty({
    description: 'Interpreter Language',
    example: 'French',
  })
  @IsOptional()
  language?: string;

  @ApiProperty({
    description: 'Interpreter City',
    example: 'Victoria',
  })
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Booking date',
    example: [
      {
        date: faker.date.recent(),
        arrivalTime: '12:00',
        period: BookingPeriod.MORNING,
      },
    ],
    required: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookingDateDto)
  dates: BookingDateDto[];
}
