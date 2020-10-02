import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Max, Min } from 'class-validator';

export class PaginationQueryDTO {
  @ApiProperty({
    description: `
      The page index number
    `,
    example: '1',
    required: false,
  })
  @Min(1)
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    description: `
      The maximum size for every page, default is 10
    `,
    example: '10',
    required: false,
  })
  @Max(100)
  @Min(1)
  @IsOptional()
  @IsNumber()
  limit: number = 10;

  // @ApiProperty({
  //   description: 'entity id',
  //   example: 1,
  // })
  // @IsOptional()
  // @IsNumber()
  // id?: number;
}
