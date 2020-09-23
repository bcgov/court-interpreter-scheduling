import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'Language name',
    example: 'English',
  })
  @IsNotEmpty()
  name: string;
}
