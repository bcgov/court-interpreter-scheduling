import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Brackets, Repository, WhereExpression } from 'typeorm';
import { addMonths, format } from 'date-fns';

import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingDateEntity } from './entities/booking-date.entity';
import { BookingEntity } from './entities/booking.entity';
import { BookingRO } from './ro/booking.ro';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(InterpreterEntity)
    private readonly interpreterRepository: Repository<InterpreterEntity>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    bookingDates: BookingDateEntity[],
  ): Promise<BookingEntity> {
    const { interpreterId, language, dates, ...createDto } = createBookingDto;
    const interpreter = await this.interpreterRepository.findOneOrFail(
      {
        id: interpreterId,
      },
      { relations: ['languages'] },
    );

    const booking = this.bookingRepository.create(createDto);
    booking.interpreter = interpreter;
    booking.dates = bookingDates;

    if (language) {
      booking.language = await this.languageRepository.findOneOrFail({
        name: language,
      });
    }

    return await this.bookingRepository.save(booking);
  }

  async findAll(
    paginateBookingQueryDto: PaginateBookingQueryDto,
  ): Promise<SuccessResponse<BookingRO[]>> {
    const { page, limit, dates, isStartFromToday } = paginateBookingQueryDto;

    let query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.interpreter', 'interpreter')
      .leftJoinAndSelect('booking.language', 'language')
      .leftJoinAndSelect('booking.dates', 'dates')
      .leftJoinAndSelect('interpreter.languages', 'languages')
      .leftJoinAndSelect('languages.language', 'lang');

    query = paginateBookingQueryDto.filter(query);

    if (isStartFromToday) {
      // default query is for bookings within next 30 days
      query.andWhere('dates.date >= :today', {
        today: `${format(new Date(), 'yyyy-MM-dd')}T00:00:00`,
      });
      query.andWhere('dates.date <= :monthAway', {
        monthAway: `${format(addMonths(new Date(), 1), 'yyyy-MM-dd')}T00:00:00`,
      });
    }

    if (dates && dates.length > 0) {
      query.andWhere(
        new Brackets((sqb: WhereExpression) => {
          dates.reduce((acc, { startDate, endDate }) => {
            acc.orWhere(
              '(dates.date >= :startDate AND dates.date <= :endDate)',
              {
                startDate: `${startDate}T00:00:00`,
                endDate: `${endDate}T23:59:59`,
              },
            );
            return acc;
          }, sqb);
        }),
      );
    }

    const bookings = await query.getMany();

    return {
      data: bookings.map(b => b.toResponseObject()),
      pagination: { page, limit },
    };
  }

  async findOne(id: number): Promise<BookingEntity> {
    return await this.bookingRepository.findOneOrFail({
      relations: ['interpreter', 'language', 'dates'],
      where: { id },
    });
  }

  async update(
    id: number,
    updateBookingDto: Omit<UpdateBookingDto, 'dates'>,
    bookingDates?: BookingDateEntity[],
  ): Promise<void> {
    const { language, interpreterId, ...updateDto } = updateBookingDto;
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

    await this.bookingRepository.save(booking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.bookingRepository.findOneOrFail({ id });
    await this.bookingRepository.remove(booking);
  }
}
