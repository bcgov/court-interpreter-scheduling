import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
  Header,
  Res,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { UpdateObject } from 'src/common/interface/UpdateObject.interface';
import { BookingDateService } from './booking-date.service';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingDateEntity } from './entities/booking-date.entity';
import { BookingRO } from './ro/booking.ro';
import { EventService } from 'src/event/event.service'

import { User as IUser } from 'src/common/interface/user.interface';
import { DBUser } from 'src/common/decorator/user.decorator';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingDateService: BookingDateService,
    private readonly eventService: EventService,
  ) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<BookingRO> {
    let bookingDates: BookingDateEntity[];
    const { dates } = createBookingDto;
    if (dates && dates.length > 0) {
      try {
        bookingDates = await this.bookingDateService.create(dates);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
    const booking = await this.bookingService.create(createBookingDto, bookingDates);
    return booking.toResponseObject();
  }

  /*
    This route is invoked on load of the booking page
    It will return bookings for today and the next 30 days only
    Subsequent requests should use the /search endpoint for control of all available filters
  */

  @Get()
  async findAll(@Query() paginateBookingQueryDto: PaginateBookingQueryDto): Promise<SuccessResponse<BookingRO[]>> {
    return await this.bookingService.findAll(Object.assign(paginateBookingQueryDto, { isStartFromToday: true }));
  }

  @Post('search')
  @HttpCode(200)
  async search(@Body() paginateBookingQueryDto: PaginateBookingQueryDto): Promise<SuccessResponse<BookingRO[]>> {
    return await this.bookingService.findAll(paginateBookingQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @DBUser() user: IUser,
  ) {
    const { dates, ...updateDto } = updateBookingDto;
    const originBooking = await this.bookingService.findOne(+id);
    const originBookingDates = originBooking.dates;

    let bookingDates: BookingDateEntity[];

    if (dates && dates.length > 0) {
      try {
        const { deletedBookingDates, newInsertedBookingDates, commonBookingDates } = await this.bookingDateService.upsert(originBookingDates, dates);
        bookingDates = [...newInsertedBookingDates, ...commonBookingDates];
        if (deletedBookingDates.length > 0 || newInsertedBookingDates.length > 0) {
          await this.eventService.createBookingEvent({
            booking: originBooking,
            user,
            field: 'dates',
            previous: this.eventService.datesToString(deletedBookingDates),
            updated: newInsertedBookingDates.length ? this.eventService.datesToString(newInsertedBookingDates) : 'Dates removed'
          });
        } 
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }

    try {
      const updatedFields = await this.eventService.parseBookingUpdate(originBooking, updateDto);
      updatedFields.map((update: UpdateObject) => this.eventService.createBookingEvent({ booking: originBooking, user, ...update }));
    } catch (error) {
      Logger.log(`Failed to create update events: ${error.message}`)
    } finally {
      return this.bookingService.update(+id, updateDto, bookingDates);
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }

  @Get('/export/:id')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=test.xlsx')
  async exportExcel(@Param('id') id: string, @Res() res: Response) {
    // query booking
    const booking = await this.bookingService.findOne(+id);

    // get the workbook
    const workbook = await this.bookingService.writeToWorkbook(booking);

    return await workbook.xlsx.write(res);
  }
}
