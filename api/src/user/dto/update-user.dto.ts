import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  @ValidateIf(o => !o.kcId)
  id: string;

  @ApiProperty({
    description: 'User KC ID',
  })
  @ValidateIf(o => !o.id)
  @IsNotEmpty()
  kcId: string;

  @ApiProperty({
    description: 'User First Name',
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description: 'User Last Name',
  })
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'Location ID',
  })
  @IsNotEmpty()
  locationId: number;
}
