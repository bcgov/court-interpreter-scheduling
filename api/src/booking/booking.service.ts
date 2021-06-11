import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Brackets, Repository, WhereExpression } from 'typeorm';
import { addMonths, sub } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
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
    const workbook = new ExcelJS.Workbook();
    const { interpreter, location } = booking;
    const exportDate = new Date();

    // read adm322 template
    await workbook.xlsx.readFile(path.join(__dirname, '..', '..', '/assets/adm322.xlsx'));

    // get the worksheet
    const worksheet = workbook.getWorksheet(1);
    const setCell = setCellHelper(worksheet); // taking advantage of "closure"

    // W5, W68, F113 invoice, [first three letters of last name] + [first letter of first name] + DD + MMM (ie “APR” “MAR” “MAY”) + YY
    const firstBookingDate = booking.dates[0];
    const invoice = (
      interpreter.lastName.substring(0, 3) +
      interpreter.firstName.substring(0, 1) +
      format(firstBookingDate.date, 'ddMMMyy', { timeZone: TIME_ZONE })
    ).toUpperCase();
    setCell({ row: 5, column: 'W', value: invoice });
    setCell({ row: 68, column: 'W', value: invoice });
    setCell({ row: 113, column: 'F', value: invoice });

    // R4, R68 registry, AF111 Site#, B15 Scheduling Info, Registry Location
    if (location) {
      const { shortDescription } = location;
      setCell({ row: 4, column: 'R', value: shortDescription });
      setCell({ row: 68, column: 'R', value: shortDescription });
      setCell({ row: 111, column: 'AF', value: shortDescription });
      setCell({ row: 15, column: 'B', value: `${location?.name?.toUpperCase()} ${location.shortDescription}` });
    }

    // V111 supplier#
    setCell({ row: 111, column: 'V', value: interpreter.supplier });

    // B9 Last name + First Name
    setCell({
      row: 9,
      column: 'B',
      value: mapAndJoin([interpreter.firstName, interpreter.lastName], ' ', (str: string) => str.toUpperCase()),
    });

    // R9 Language Level
    const bookLang = booking.language;
    const intpLang = interpreter.languages.find(lan => lan.language.name === bookLang.name);
    setCell({ row: 9, column: 'R', value: String(intpLang.level) });

    // G74 finance
    if (intpLang) {
      setCell({ row: 74, column: 'G', value: String(levelToMoney[intpLang.level]) });
    }

    // B11 address + city + province + postcode
    setCell({ row: 11, column: 'B', value: mapAndJoin([interpreter.address, interpreter.city, interpreter.province]) });

    // U9 Phone
    setCell({ row: 9, column: 'U', value: interpreter.phone });

    // U11 Email
    setCell({ row: 11, column: 'U', value: interpreter.email });

    // AI5,F112, B21 Date of Export
    setCell({
      row: 5,
      column: 'AI',
      value: format(exportDate, 'yyyy-MM-dd', { timeZone: TIME_ZONE }),
      alignment: 'center',
    });
    setCell({
      row: 112,
      column: 'F',
      value: format(exportDate, 'yyyy-MM-dd', { timeZone: TIME_ZONE }),
      alignment: 'center',
    });
    setCell({ row: 21, column: 'B', value: format(exportDate, 'yyyy-MM-dd', { timeZone: TIME_ZONE }) });

    // L21 Federal
    setCell({ row: 21, column: 'L', value: formatYesNo(booking.federal) });

    // B23 Comments
    setCell({ row: 23, column: 'B', value: booking.comment });

    // K79 GST
    setCell({ row: 79, column: 'K', value: interpreter.gst });

    // S79 if has GST, add rate 0.05
    if (interpreter.gst) {
      setCell({ row: 79, column: 'S', value: 0.05 });
    }

    // L19 Method Of Appearance
    setCell({ row: 19, column: 'L', value: booking.methodOfAppearance });

    // L15 interpreterFor, L17 requestedBy
    setCell({ row: 15, column: 'L', value: booking.interpretFor });
    setCell({ row: 17, column: 'L', value: booking.requestedBy });

    // J83 distance km, G83 rate
    console.info('distance: ', distance);
    if (distance) {
      setCell({ row: 83, column: 'J', value: distance.distance });
    }
    setCell({ row: 83, column: 'G', value: 0.55 });

    // booking dates
    booking.dates.forEach((date, idx) => {
      // as there are only max 9 rows in adm322
      if (idx < 9) {
        const row = idx * 3 + 28;
        // B28 date
        setCell({ row, column: 'B', value: format(new Date(date.date), 'yyyy-MM-dd', { timeZone: TIME_ZONE }) });

        // D28 Court File Number
        setCell({ row, column: 'D', value: booking.file });

        // H28 Case Number
        setCell({ row, column: 'H', value: booking.caseName, alignment: 'center' });

        // M28 Language
        setCell({ row, column: 'M', value: booking.language.name });

        // Q28 Reason
        setCell({ row, column: 'Q', value: booking.reason });

        // W28 Cour Room
        setCell({ row, column: 'W', value: booking.room });

        // H29 Federal prosecuters name
        setCell({ row: 3 * idx + 29, column: 'H', value: booking.prosecutor });
      }
    });

    return workbook;
  }
}
