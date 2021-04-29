import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User uuid',
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'User KC ID',
  })
  @IsNotEmpty()
  kcId: string;

  @ApiProperty({
    description: 'Location ID',
  })
  @IsNotEmpty()
  locationId: number;
}
