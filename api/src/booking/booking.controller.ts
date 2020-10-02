import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { BookingDateService } from './booking-date.service';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingDateEntity } from './entities/booking-date.entity';
import { BookingEntity } from './entities/booking.entity';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingDateService: BookingDateService,
  ) {}

  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingEntity> {
    let bookingDates: BookingDateEntity[];
    const { dates } = createBookingDto;
    if (dates && dates.length > 0) {
      try {
        bookingDates = await this.bookingDateService.create(dates);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
    return await this.bookingService.create(createBookingDto, bookingDates);
  }

  @Get()
  async findAll(
    @Query() paginateBookingQueryDto: PaginateBookingQueryDto,
  ): Promise<SuccessResponse<BookingEntity[]>> {
    return await this.bookingService.findAll(paginateBookingQueryDto);
  }

  @Post('search')
  async search(
    @Body() paginateBookingQueryDto: PaginateBookingQueryDto,
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
