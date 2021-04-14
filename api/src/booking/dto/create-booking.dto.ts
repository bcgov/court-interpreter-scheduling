import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import * as faker from 'faker/locale/en_CA';
import { BookingPeriod } from '../enums/booking-period.enum';
import { BookingStatus } from '../enums/booking-status.enum';
import { BookingDateDto } from './booking-date.dto';
import { LanguageDisplayNameToNameMap } from '../../common/constant';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Interpreter id',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  interpreterId: number;

  @ApiProperty({
    description: 'Case name',
    example: 'Montague vs Capulet',
  })
  @IsOptional()
  caseName?: string;

  @ApiProperty({
    description: 'Room at courthouse for this matter',
    example: faker.random.number({ max: 9999 }),
  })
  @IsOptional()
  room?: string;

  @ApiProperty({
    description: 'Booking status',
    example: BookingStatus.PENDING,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({
    description: 'Booking date',
    example: [
      {
        date: faker.date.recent(),
        arrivalTime: '10:00',
        period: BookingPeriod.MORNING,
      },
    ],
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BookingDateDto)
  dates: BookingDateDto[];

  @ApiProperty({
    description: 'Booking registry',
    example: 'registry',
  })
  @IsOptional()
  registry?: string;

  @ApiProperty({
    description: 'Court file number',
    example: 'VAN-PC-1981',
  })
  @IsOptional()
  file?: string;

  @ApiProperty({
    description: 'To interpret on behalf of whom',
    example: 'defendant',
  })
  @IsOptional()
  interpretFor?: string;

  @ApiProperty({
    description: 'Who the interpreter is being requested by',
    example: 'prosecutor',
  })
  @IsOptional()
  requestedBy?: string;

  @ApiProperty({
    description: 'Federal or provincial/civil matter',
    example: true,
  })
  @IsOptional()
  federal?: boolean;

  @ApiProperty({
    description: 'Booking Language name from Language Entity',
    example: 'French',
  })
  @IsOptional()
  @Transform((value: string) => LanguageDisplayNameToNameMap.get(value) || value)
  language?: string;

  @ApiProperty({
    description: 'Reason for this booking',
    example: faker.lorem.sentence(),
  })
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Prosecutor name for this matter',
    example: 'prosecutor',
  })
  @IsOptional()
  prosecutor?: string;

  @ApiProperty({
    description: 'Booking comment',
    example: faker.lorem.sentence(),
  })
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'Id of the location object',
    example: '1',
  })
  @IsOptional()
  location: number;
}
