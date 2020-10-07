import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Brackets, Repository, WhereExpression } from 'typeorm';

import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingDateEntity } from './entities/booking-date.entity';
import { BookingEntity } from './entities/booking.entity';

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
    const interpreter = await this.interpreterRepository.findOneOrFail({
      id: interpreterId,
    });

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
  ): Promise<SuccessResponse<BookingEntity[]>> {
    const { page, limit, interpreter, file, dates } = paginateBookingQueryDto;

    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.interpreter', 'interpreter')
      .leftJoinAndSelect('booking.language', 'language')
      .leftJoinAndSelect('booking.dates', 'dates')
      .leftJoinAndSelect('interpreter.languages', 'languages')
      .leftJoinAndSelect('languages.language', 'lang')
      .offset((page - 1) * limit)
      .limit(limit);

    if (file) {
      query.andWhere('LOWER(booking.file) like LOWER(:file)', {
        file: `%${file}%`,
      });
    }

    if (interpreter) {
      query.andWhere(
        new Brackets(sqb => {
          sqb
            .where('LOWER(interpreter.firstName) like LOWER(:name)', {
              name: `%${interpreter}%`,
            })
            .orWhere('LOWER(interpreter.lastName) like LOWER(:name)', {
              name: `%${interpreter}%`,
            });
        }),
      );
    }

    if (dates) {
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
      data: bookings,
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
