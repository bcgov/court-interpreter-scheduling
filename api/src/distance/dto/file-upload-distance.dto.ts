import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class FileUploadDistanceDto {
  @ApiProperty({
    description: 'empty the interpreter table',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEmptyTable?: boolean;
}
