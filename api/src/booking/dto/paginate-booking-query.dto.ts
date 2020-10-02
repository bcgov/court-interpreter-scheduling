import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import * as faker from 'faker/locale/en_CA';

import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { SearchDateDto } from './search-date.dto';

export class PaginateBookingQueryDto extends PaginationQueryDTO {
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
  location?: string;

  @ApiProperty({
    description: 'Case File Number',
    example: 'VAN-P-C-123456',
  })
  @IsOptional()
  file?: string;
}
