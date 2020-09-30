import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingEntity> {
    console.log(createBookingDto);
    return await this.bookingService.create(createBookingDto);
  }

  @Get()
  async findAll(
    @Query() paginateBookingQueryDto: PaginateBookingQueryDto,
  ): Promise<SuccessResponse<BookingEntity[]>> {
    return await this.bookingService.findAll(paginateBookingQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
