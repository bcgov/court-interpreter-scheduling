import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, Max, Min, IsNumber, IsDate } from 'class-validator';
import * as faker from 'faker/locale/en_CA';
import { BookingDateDto } from 'src/booking/dto/booking-date.dto';
import { BookingPeriod } from 'src/booking/enums/booking-period.enum';
import { AndWhere } from 'src/common/decorator/query.decorator';

import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { SelectQueryBuilder } from 'typeorm';
import { Level } from '../enums/level.enum';

export class PaginateInterpreterQueryDto extends PaginationQueryDTO {
  @ApiProperty({
    description: `
      The maximum size for every page, default is 1000
    `,
    example: '1000',
    required: false,
  })
  @Max(1000)
  @Min(1)
  @IsOptional()
  @IsNumber()
  limit: number = 1000;

  @ApiProperty({
    description: `
      Multiple interpreter level from 1 to 4,
      Like: level[]=2&level[]=3
    `,
    example: Level.one,
    enum: [1, 2, 3, 4],
  })
  @IsOptional()
  level?: Level[];

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
    description: 'Courthouse address',
    example: '555 Columbia Avenue',
  })
  @IsOptional()
  courtAddr?: string;

  @ApiProperty({
    description: 'Distance limit between Courthouse address',
    example: 32,
  })
  @IsOptional()
  distanceLimit?: number;

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
  dates?: BookingDateDto[];

  @ApiProperty({
    description: 'Interpreter Name',
    example: faker.name.firstName(),
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Interpreter Keywords, searching phone, email, etc...',
    example: faker.lorem.word(),
  })
  @IsOptional()
  keywords?: string;

  @ApiProperty({
    description: 'Interpreter Active/Inactive indicator',
    example: faker.random.boolean(),
  })
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    description: 'Interpreter Criminal record date object',
    example: faker.date.recent(),
  })
  @IsDate()
  @IsOptional()
  criminalRecordCheck: Date;

  @AndWhere('intLang.level IN (:...level)', 'level')
  @AndWhere('LOWER(interpreter.city) = LOWER(:city)', 'city')
  @AndWhere(`LOWER(CONCAT(interpreter.firstName, ' ', interpreter.lastName)) LIKE LOWER(:name)`, 'name')
  @AndWhere('interpreter.contract_extension = :active', 'active')
  filter(query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    return super.filter(query).andWhere('LOWER(intLang.language.name) LIKE LOWER(:language)', {
      language: `${this.language || ''}%`,
    });
  }
}
