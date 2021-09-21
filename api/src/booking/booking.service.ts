import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Brackets, Repository, WhereExpression } from 'typeorm';
import { addMonths, sub, parse } from 'date-fns';
import { format, utcToZonedTime, toDate } from 'date-fns-tz';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingDateEntity } from './entities/booking-date.entity';
import { BookingEntity } from './entities/booking.entity';
import { BookingRO } from './ro/booking.ro';
import { mapAndJoin, formatYesNo, setCellHelper, levelToMoney } from 'src/utils';
import { LocationEntity } from 'src/location/entities/location.entity';
import { DistanceEntity } from 'src/distance/entities/distance.entity';

const TIME_ZONE = 'America/Los_Angeles';
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(InterpreterEntity)
    private readonly interpreterRepository: Repository<InterpreterEntity>,
    @InjectRepository(LocationEntity) private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto, bookingDates: BookingDateEntity[]): Promise<BookingEntity> {
    const { interpreterId, language, dates, locationId, ...createDto } = createBookingDto;
    const interpreter = await this.interpreterRepository.findOneOrFail(
      {
        id: interpreterId,
      },
      { relations: ['languages'] },
    );
    let location: LocationEntity;
    if (locationId) {
      location = await this.locationRepository.findOne({
        id: locationId,
      });
    }

    const booking = this.bookingRepository.create({ ...createDto });
    booking.interpreter = interpreter;
    booking.dates = bookingDates;
    booking.location = location;

    if (language) {
      booking.language = await this.languageRepository.findOneOrFail({
        name: language,
      });
    }

    return await this.bookingRepository.save(booking);
  }

  async findAll(paginateBookingQueryDto: PaginateBookingQueryDto): Promise<SuccessResponse<BookingRO[]>> {
    const { page, limit, dates, isStartFromToday } = paginateBookingQueryDto;

    let query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.interpreter', 'interpreter')
      .leftJoinAndSelect('booking.language', 'language')
      .leftJoinAndSelect('booking.dates', 'dates')
      .leftJoinAndSelect('booking.events', 'event', `event.createdAt > :thirtyDaysAgo`, {
        thirtyDaysAgo: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd', { timeZone: TIME_ZONE }),
      })
      .leftJoinAndSelect('event.user', 'eventUser')
      .leftJoinAndSelect('interpreter.languages', 'languages')
      .leftJoinAndSelect('languages.language', 'lang')
      .leftJoinAndSelect('booking.location', 'location');

    query = paginateBookingQueryDto.filter(query);

    if (isStartFromToday) {
      // default query is for bookings within next 30 days
      const today = utcToZonedTime(new Date(), TIME_ZONE);
      query.andWhere('dates.date >= :today', {
        today: `${format(today, 'yyyy-MM-dd', { timeZone: TIME_ZONE })}T00:00:00`,
      });
      query.andWhere('dates.date <= :monthAway', {
        monthAway: `${format(addMonths(today, 1), 'yyyy-MM-dd', { timeZone: TIME_ZONE })}T00:00:00`,
      });
    }

    if (dates && dates.length > 0) {
      query.andWhere(
        new Brackets((sqb: WhereExpression) => {
          dates.reduce((acc, { startDate, endDate }) => {
            acc.orWhere('(dates.date >= :startDate AND dates.date <= :endDate)', {
              startDate: `${startDate}T00:00:00`,
              endDate: `${endDate}T23:59:59`,
            });
            return acc;
          }, sqb);
        }),
      );
    }

    if (paginateBookingQueryDto.locationName) {
      query.andWhere('location.name = :locationName', { locationName: paginateBookingQueryDto.locationName });
    }

    if (paginateBookingQueryDto.locationId) {
      query.andWhere('location.id = :locationId', { locationId: paginateBookingQueryDto.locationId });
    }

    const bookings = await query.getMany();

    return {
      data: bookings.map(b => b.toResponseObject()),
      pagination: { page, limit },
    };
  }

  async findOne(id: number): Promise<BookingEntity> {
    return await this.bookingRepository.findOneOrFail({
      relations: ['interpreter', 'language', 'dates', 'location'],
      where: { id },
    });
  }

  async update(
    id: number,
    updateBookingDto: Omit<UpdateBookingDto, 'dates'>,
    bookingDates?: BookingDateEntity[],
  ): Promise<void> {
    const { language, interpreterId, locationId, ...updateDto } = updateBookingDto;
    const booking = this.bookingRepository.create({ id, ...updateDto });

    if (language) {
      const lang = await this.languageRepository.findOneOrFail({
        name: language,
      });
      booking.language = lang;
    }

    if (interpreterId) {
      const interpreter = await this.interpreterRepository.findOneOrFail({
        id: interpreterId,
      });
      booking.interpreter = interpreter;
    }

    if (bookingDates && bookingDates.length > 0) {
      booking.dates = bookingDates;
    }

    let location: LocationEntity;
    if (locationId) {
      location = await this.locationRepository.findOne({
        id: locationId,
      });
      booking.location = location;
    }

    await this.bookingRepository.save(booking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.bookingRepository.findOneOrFail({ id });
    await this.bookingRepository.remove(booking);
  }

  async writeToWorkbook(booking: BookingEntity, distance: DistanceEntity): Promise<ExcelJS.Workbook> {
    const section3StartRowNumber = 28;
    const section3BlankRowSetsInTemplate = 100;
    const bookingDateRowSets = booking.dates.length;
    const totalSection3RowsToHide = section3BlankRowSetsInTemplate - bookingDateRowSets;
    const section3StartRowNumberToHide = section3StartRowNumber + (bookingDateRowSets * 3);
    const section3EndRowNumberToHide = section3StartRowNumberToHide + (totalSection3RowsToHide * 3);

    const workbook = new ExcelJS.Workbook();
    const { interpreter, location } = booking;
    const invoiceAndExportDate = format(new Date(), 'yyyy-MM-dd', { timeZone: TIME_ZONE });

    // read adm322 template, section 3 has ${section3BlankRowSetsInTemplate} templated rows that are hidden
    //  if unused
    await workbook.xlsx.readFile(path.join(__dirname, '..', '..', '/assets/adm322.xlsx'));

    // get the worksheet
    const worksheet = workbook.getWorksheet(1);
    const setCell = setCellHelper(worksheet); // taking advantage of "closure"

    // Invoice number format: [first three letters of last name] + [first letter of first name] + DD + MMM (ie “APR” “MAR” “MAY”) + YY
    const firstBookingDate = booking.dates[0];
    const invoice = (
      interpreter.lastName.substring(0, 3) +
      interpreter.firstName.substring(0, 1) +
      format(firstBookingDate.date, 'ddMMMyy', { timeZone: TIME_ZONE })
    ).toUpperCase();

  /*
  Section 1 - Header Section, Control/Invoice No
    Rows 2 - 5, Columns R-AQ
   */
    // if the location is known then set the Registry #
    if (location) {
      setCell({ row: 4, column: 'R', value: location.shortDescription });
    }
    // Invoice #
    setCell({ row: 5, column: 'W', value: invoice });
    // Invoice Date
    setCell({
      row: 5,
      column: 'AI',
      value: invoiceAndExportDate
    });

  /*
  Section 1 - Interpreter Information
    Rows 7 - 11, Columns B-U
  */
    const lastNameFirstName = mapAndJoin([interpreter.firstName, interpreter.lastName], ' ', (str: string) => str.toUpperCase())
    // Last name + First Name
    setCell({
      row: 9,
      column: 'B',
      value: lastNameFirstName
    });

    const bookLang = booking.language;
    const intpLang = interpreter.languages.find(lan => lan.language.name === bookLang.name);
    // Level
    setCell({ row: 9, column: 'R', value: String(intpLang.level) });
    // Phone
    setCell({ row: 9, column: 'U', value: interpreter.phone });
    // address + city + province + postcode
    setCell({ row: 11, column: 'B', value: mapAndJoin([interpreter.address, interpreter.city, interpreter.province]) });
    // Email
    setCell({ row: 11, column: 'U', value: interpreter.email });

  /*
  Section 2 - Scheduling Information
    Rows 13 - 23, Columns B-U
  */
    // Registry Location
    if (location) {
      setCell({ row: 15, column: 'B', value: `${location?.name?.toUpperCase()} ${location.shortDescription}` });
    }
    // Interpreter For
    setCell({ row: 15, column: 'L', value: booking.interpretFor });
    // Requested By
    setCell({ row: 17, column: 'L', value: booking.requestedBy });
    // Method Of Appearance
    setCell({ row: 19, column: 'L', value: booking.methodOfAppearance });
    // Date of Booking
    setCell({ row: 21, column: 'B', value: invoiceAndExportDate });
    // Federal Matter
    setCell({ row: 21, column: 'L', value: formatYesNo(booking.federal) });
    // Additional Comments
    setCell({ row: 23, column: 'B', value: booking.comment });

  /*
  Section 3 - Record
    Rows ${section3StartRowNumber} - ${bookingDateRowSets * 3 (3 rows per booking record)}, Columns B-AQ
   */
    booking.dates
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((date, idx) => {
        const row = idx * 3 + section3StartRowNumber;
        const bookingDate = toDate(new Date(date.date), {timeZone: TIME_ZONE});
        const bookingDateStr = parse(`${bookingDate.getFullYear()}-${('0' + (bookingDate.getMonth() + 1)).slice(-2)}-${('0' + bookingDate.getDate()).slice(-2)} ${date.arrivalTime}`,
          'yyyy-MM-dd HH:mm:ss',
          new Date(date.date));
        const bookingTime = format(bookingDateStr, 'h:mm a');
        // Date Required
        setCell({ row, column: 'B', value: format(new Date(date.date), 'yyyy-MM-dd', { timeZone: TIME_ZONE }) });
        // Court File Number
        setCell({ row, column: 'D', value: booking.file });
        // Case Name
        setCell({ row, column: 'H', value: booking.caseName, alignment: 'center' });
        // Language
        setCell({ row, column: 'M', value: booking.language.name });
        // Reason
        setCell({ row, column: 'Q', value: booking.reason });
        // Court Room
        setCell({ row, column: 'W', value: booking.room });
        // Start Time
        setCell({ row, column: 'AC', value: bookingTime });
        // Federal Prosecutors Name
        setCell({ row: 3 * idx + section3StartRowNumber + 1, column: 'H', value: booking.prosecutor });
    });

    // we hide the rows in the section 3 template as the only way to keep this report functional and dynamically
    //  support booking.dates > 9 we just throw lots of rows into the spreadsheet template and hide the unused ones
    // console.log(`we need to hide ${totalSection3RowsToHide} rows, starting at ${section3StartRowNumberToHide} to ${section3EndRowNumberToHide}`);
    for (let i = section3StartRowNumberToHide; i < section3EndRowNumberToHide; i++) {
      const row = worksheet.getRow(i);
      row.hidden = true;
    }

  /*
  Section 4 - Cancellation Information
    Rows ${section3EndRowNumberToHide + 1} to ${section3EndRowNumberToHide + 1} + 3, Columns B-AQ
   */
    // Not pre-populated

  /*
  Section 4 - Notes
    Rows ${section3EndRowNumberToHide + 1 + 3} to ${section3EndRowNumberToHide + 1 + 3} + 4, Columns B-AQ
   */
    // Not pre-populated

  /*
  Section 5 - Control/Invoice No. Header Section
    Rows ${section3EndRowNumberToHide + 1 + 3} to ${section3EndRowNumberToHide + 1 + 3} + 13, Columns B-AQ
   */
    if (location) {
      // Registry #
      setCell({ row: section3EndRowNumberToHide + 13, column: 'R', value: location.shortDescription });
    }
    // Invoice #
    setCell({ row: section3EndRowNumberToHide + 13, column: 'W', value: invoice });
    // Invoice Date
    setCell({ row: section3EndRowNumberToHide + 14, column: 'AI', value: invoiceAndExportDate });

  /*
  Section 5 - Payment Details
   */
    // Fees, Court Hours, Rate
    if (intpLang) {
      setCell({
        row: section3EndRowNumberToHide + 19,
        column: 'G',
        value: String(levelToMoney[intpLang.level])
      });
    }

    // GST Number
    setCell({ row: section3EndRowNumberToHide + 24, column: 'K', value: interpreter.gst });

    // add GST rate 0.05 if GST Number is present, otherwise default GST rate to 0
    if (interpreter.gst) {
      setCell({ row: section3EndRowNumberToHide + 24, column: 'S', value: 0.05 });
    } else {
      setCell({ row: section3EndRowNumberToHide + 24, column: 'S', value: 0 });
    }

    // Set the Expenses Travel Kilometres Rate to 0.55 if distance > 32 and set the total distance if available
    if (distance && Number(distance?.distance) > 32) {
      // Expenses Travel Kilometres Rate
      setCell({ row: section3EndRowNumberToHide + 28, column: 'G', value: 0.55 });
      setCell({
        row: section3EndRowNumberToHide + 28,
        column: 'J',
        value: distance.distance
      });
    }

  /*
  Section 6 - Authorizations
   */
    // Not pre-populated
 
  /*
  Office Use Only - End of Document
   */
    // Supplier Name
    setCell({
      row: section3EndRowNumberToHide + 56,
      column: 'F',
      value: lastNameFirstName
    });
    // Supplier #
    setCell({
      row: section3EndRowNumberToHide + 56,
      column: 'V',
      value: interpreter.supplier
    });
    // Site #
    if (location) {
      setCell({
        row: section3EndRowNumberToHide + 56,
        column: 'AF',
        value: location.shortDescription
      });
    }
    // Invoice Date
    setCell({
      row: section3EndRowNumberToHide + 57,
      column: 'F',
      value: invoiceAndExportDate
    });
    // Invoice Number
    setCell({ row: section3EndRowNumberToHide + 58, column: 'F', value: invoice });

    return workbook;
  }
}
