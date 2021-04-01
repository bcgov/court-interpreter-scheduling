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
import { format } from 'date-fns';

import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { Level } from 'src/interpreter/enums/level.enum';
import { formatYesNo, getIndexOfAlphabet } from 'src/utils';
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
    // query booking
    const booking = await this.bookingService.findOne(+id);
    const { interpreter } = booking;

    // generate excel file
    const workbook = new ExcelJS.Workbook();

    // read adm322 template
    await workbook.xlsx.readFile(path.join(__dirname, '..', '..', '/assets/adm322.xlsx'));

    // A10 Last name + First Name
    const worksheet = workbook.getWorksheet(1);
    let row = worksheet.getRow(10);
    row.getCell(getIndexOfAlphabet('A')).value = `${interpreter.firstName} ${booking.interpreter.lastName}`;
    row.commit();

    // A15 Phone
    row = worksheet.getRow(15);
    row.getCell(getIndexOfAlphabet('A')).value = interpreter.phone;
    row.commit();

    // G15 Email
    row = worksheet.getRow(15);
    row.getCell(getIndexOfAlphabet('G')).value = interpreter.email;
    row.commit();

    // B16, E16, H16, K16 Language Level
    const bookLang = booking.language;
    const intpLang = interpreter.languages.find(lan => lan.language.name === bookLang.name);
    row = worksheet.getRow(16);
    switch (intpLang?.level) {
      case Level.one: {
        row.getCell(getIndexOfAlphabet('B')).value = 'X';
        break;
      }
      case Level.two: {
        row.getCell(getIndexOfAlphabet('E')).value = 'X';
        break;
      }
      case Level.three: {
        row.getCell(getIndexOfAlphabet('H')).value = 'X';
        break;
      }
      case Level.four: {
        row.getCell(getIndexOfAlphabet('K')).value = 'X';
        break;
      }
      default: {
        row.getCell(getIndexOfAlphabet('B')).value = 'X';
      }
    }
    row.commit();

    // P16 Date of Export
    row = worksheet.getRow(16);
    row.getCell(getIndexOfAlphabet('P')).value = format(new Date(), 'yyyy-LLL-dd');
    row.commit();

    // D18 Federal
    row = worksheet.getRow(18);
    row.getCell(getIndexOfAlphabet('D')).value = formatYesNo(booking.federal);
    row.commit();

    // A19 Comments
    row = worksheet.getRow(19);
    row.getCell(getIndexOfAlphabet('A')).value = booking.comment;
    row.commit();

    // A25 Date of first Booking
    row = worksheet.getRow(25);
    row.getCell(getIndexOfAlphabet('A')).value = format(new Date(booking.dates[0].date), 'yyyy-LLL-dd');
    row.commit();

    // C25 Court File Number
    row = worksheet.getRow(25);
    row.getCell(getIndexOfAlphabet('C')).value = booking.file;
    row.commit();

    // G25 Case Number
    row = worksheet.getRow(25);
    row.getCell(getIndexOfAlphabet('G')).value = booking.caseName;
    row.commit();

    // L25 Language
    row = worksheet.getRow(25);
    row.getCell(getIndexOfAlphabet('L')).value = booking.language.name;
    row.commit();

    // P25 Reason
    row = worksheet.getRow(25);
    row.getCell(getIndexOfAlphabet('P')).value = booking.reason;
    row.commit();

    // V25 Cour Room
    row = worksheet.getRow(25);
    row.getCell(getIndexOfAlphabet('V')).value = booking.room;
    row.commit();

    // H39 Federal prosecuters name
    row = worksheet.getRow(39);
    row.getCell(getIndexOfAlphabet('H')).value = booking.federal;
    row.commit();

    // K75 GST
    row = worksheet.getRow(75);
    row.getCell(getIndexOfAlphabet('K')).value = interpreter.gst;
    row.commit();

    return await workbook.xlsx.write(res);
  }
}
