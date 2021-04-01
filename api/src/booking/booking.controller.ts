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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as path from 'path';

import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { Level } from 'src/interpreter/enums/level.enum';
import { BookingDateService } from './booking-date.service';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingDateEntity } from './entities/booking-date.entity';
import { BookingRO } from './ro/booking.ro';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingDateService: BookingDateService,
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
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    const { dates, ...updateDto } = updateBookingDto;
    const originBooking = await this.bookingService.findOne(+id);
    const originBookingDates = originBooking.dates;

    let bookingDates: BookingDateEntity[];

    if (dates && dates.length > 0) {
      try {
        bookingDates = await this.bookingDateService.create(dates);
        await this.bookingDateService.removeByBookings(originBookingDates);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }

    return this.bookingService.update(+id, updateDto, bookingDates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }

  @Get('/export/:id')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=test.xlsx')
  async exportExcel(@Param('id') id: string, @Res() res: Response) {
    //query booking
    const booking = await this.bookingService.findOne(+id);
    const { interpreter } = booking;
    //TODO generate excel file
    const workbook = new ExcelJS.Workbook();
    // read adm322 template
    await workbook.xlsx.readFile(path.join(__dirname, '..', '..', '/assets/adm322.xlsx'));

    // A10
    const worksheet = workbook.getWorksheet(1);
    let row = worksheet.getRow(10);
    row.getCell(1).value = `${interpreter.firstName} ${booking.interpreter.lastName}`;
    row.commit();

    // A15
    row = worksheet.getRow(15);
    row.getCell(1).value = interpreter.phone;
    row.commit();

    // G15
    row = worksheet.getRow(15);
    row.getCell(7).value = interpreter.email;
    row.commit();

    // B16, E16, H16, K16
    const bookLang = booking.language;
    const intpLang = interpreter.languages.find(lan => lan.language.name === bookLang.name);
    row = worksheet.getRow(16);
    switch (intpLang?.level) {
      case Level.one: {
        row.getCell(2).value = 'X';
        break;
      }
      case Level.two: {
        row.getCell(5).value = 'X';
        break;
      }
      case Level.three: {
        row.getCell(8).value = 'X';
        break;
      }
      case Level.four: {
        row.getCell(11).value = 'X';
        break;
      }
      default: {
        row.getCell(2).value = 'X';
      }
    }
    row.commit();

    return await workbook.xlsx.write(res);
  }
}
