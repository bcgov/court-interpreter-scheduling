import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Level } from '../enums/level.enum';

export class InterpreterLanguageDTO {
  @ApiProperty({
    description: 'Interpreter Language',
    example: 'French',
  })
  @IsNotEmpty()
  languageName: string;

  @ApiProperty({
    description: 'Language level from 1 to 4',
    example: 1,
    enum: [1, 2, 3, 4],
  })
  @IsEnum(Level)
  level: Level;

  @ApiProperty({
    description: 'comment on level',
    example: 'comment',
  })
  @IsString()
  @IsOptional()
  commentOnLevel: string;
}
