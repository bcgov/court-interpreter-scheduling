import { ApiProperty } from '@nestjs/swagger';
import * as faker from 'faker/locale/en_CA';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { Level } from '../enums/level.enum';

export class CreateInterpreterDto {
  @ApiProperty({
    description: 'Interpreter name',
    example: faker.name.findName(),
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Interpreter level from 1 to 4',
    example: 1,
    enum: [1, 2, 3, 4],
  })
  @IsEnum(Level)
  @IsOptional()
  level: Level;

  @ApiProperty({
    description: 'Interpreter Language id',
    example: faker.random.uuid(),
  })
  @IsUUID(4)
  @IsOptional()
  languageId: string;

  @ApiProperty({
    description: 'Interpreter phone number',
    example: faker.phone.phoneNumber(),
  })
  @IsOptional()
  @IsPhoneNumber('CA')
  phone: string;

  @ApiProperty({
    description: 'Interpreter email',
    example: faker.internet.email(),
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Interpreter distance',
    example: 1.5,
  })
  @IsOptional()
  @IsNumber()
  distance: number;
}
