import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import * as faker from 'faker/locale/en_CA';

import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class PaginateBookingQueryDto extends PaginationQueryDTO {
  @ApiProperty({
    description: 'Date',
    example: '2020-09-30',
  })
  @IsOptional()
  date?: Date;

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
