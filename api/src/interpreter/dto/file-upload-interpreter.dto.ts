import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class FileUploadInterpreterDto {
  @ApiProperty({
    description: 'if is visual interpreter',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisual?: boolean;

  @ApiProperty({
    description: 'empty the interpreter table',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEmptyTable?: boolean;

  @ApiProperty({
    description: 'anonymize the interpreter table',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({
    description: 'if want to update table instead of empty table',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isUpdate?: boolean;
}
