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
      The maximum size for every page
    `,
    example: '8',
    required: false,
  })
  @Max(100)
  @Min(1)
  @IsOptional()
  @IsNumber()
  limit: number = 8;
}
