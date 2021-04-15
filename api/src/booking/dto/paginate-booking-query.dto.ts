import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import * as faker from 'faker/locale/en_CA';
import { SelectQueryBuilder } from 'typeorm';

import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { AndWhere } from 'src/common/decorator/query.decorator';
import { SearchDateDto } from './search-date.dto';

export class PaginateBookingQueryDto extends PaginationQueryDTO {
  @ApiProperty({
    description: `
      The maximum size for every page, default is 50
    `,
    example: '50',
    required: false,
  })
  @Max(50)
  @Min(1)
  @IsOptional()
  @IsNumber()
  limit: number = 50;

  @ApiProperty({
    description: 'Date',
    example: [
      { startDate: '2020-09-21', endDate: '2020-09-30' },
      { startDate: '2020-10-01', endDate: '2020-10-01' },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SearchDateDto)
  dates?: SearchDateDto[];

  @ApiProperty({
    description: 'Interpreter Name',
    example: faker.name.firstName(),
  })
  @IsOptional()
  interpreter?: string;

  @ApiProperty({
    description: 'Courthouse location',
    example: 'Vancouver',
  })
  @IsOptional()
  locationName?: string;

  @ApiProperty({
    description: 'Case File Number',
    example: 'VAN-P-C-123456',
  })
  @IsOptional()
  file?: string;

  @ApiProperty({
    description: 'Start from today',
    example: true,
  })
  @IsOptional()
  isStartFromToday?: boolean;

  @AndWhere(`LOWER(CONCAT(interpreter.firstName, ' ', interpreter.lastName)) LIKE LOWER(:interpreter)`, 'interpreter')
  @AndWhere('LOWER(booking.file) LIKE LOWER(:file)', 'file')
  filter(query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    return super.filter(query);
  }
}
