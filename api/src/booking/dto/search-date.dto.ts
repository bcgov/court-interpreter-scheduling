import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from 'src/common/decorator/isOnlyDate.decorator';

export class SearchDateDto {
  @ApiProperty({
    description: 'start date, format: YYYY-MM-DD',
    example: '2020-09-20',
  })
  @IsNotEmpty()
  @IsOnlyDate()
  startDate: string;

  @ApiProperty({
    description: 'end date',
    example: '2020-10-01',
  })
  @IsNotEmpty()
  @IsOnlyDate()
  endDate: string;
}
