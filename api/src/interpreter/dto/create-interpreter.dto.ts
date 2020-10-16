import { ApiProperty } from '@nestjs/swagger';
import * as faker from 'faker/locale/en_CA';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
  IsPostalCode,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

import { InterpreterLanguageDTO } from './interpreter-language.dto';

export class CreateInterpreterDto {
  @ApiProperty({
    description: 'Interpreter name',
    example: faker.name.firstName(),
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Interpreter name',
    example: faker.name.lastName(),
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Interpreter Language',
    example: [{ languageName: 'French', level: 3, commentOnLevel: 'comment' }],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InterpreterLanguageDTO)
  languages: InterpreterLanguageDTO[];

  @ApiProperty({
    description: 'Street Address',
    example: faker.address.streetAddress(),
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'City',
    example: faker.address.city(),
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    description: 'Province',
    example: 'BC',
  })
  @IsOptional()
  province: string;

  @ApiProperty({
    description: 'Postal Code',
    example: faker.address.zipCode(),
  })
  @IsOptional()
  @IsPostalCode('CA')
  postal: string;

  @ApiProperty({
    description: 'Home phone number',
    example: faker.phone.phoneNumber(),
  })
  @IsOptional()
  @IsPhoneNumber('CA')
  homePhone: string;

  @ApiProperty({
    description: 'Business phone number',
    example: faker.phone.phoneNumber(),
  })
  @IsOptional()
  @IsPhoneNumber('CA')
  businessPhone: string;

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
    description: 'Supplier',
    example: '1234567',
  })
  @IsOptional()
  supplier: string;

  @ApiProperty({
    description: 'GST',
    example: '123456789-RT0001',
  })
  @IsOptional()
  gst: string;

  @ApiProperty({
    description: 'Comments',
    example: 'Civil and family matters only',
  })
  @IsOptional()
  comments: string;

  @ApiProperty({
    description: 'Contract Extension',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  contractExtension: boolean;

  @ApiProperty({
    description: 'Contract Termination',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  contractTermination: boolean;
}
