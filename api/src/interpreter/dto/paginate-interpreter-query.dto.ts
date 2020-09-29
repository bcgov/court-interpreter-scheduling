import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import * as faker from 'faker/locale/en_CA';

import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { Level } from '../enums/level.enum';

export class PaginateInterpreterQueryDTO extends PaginationQueryDTO {
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
}
