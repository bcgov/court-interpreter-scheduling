import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Brackets, Repository } from 'typeorm';

import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginateBookingQueryDto } from './dto/paginate-booking-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
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

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const { interpreterId, language, ...createDto } = createBookingDto;
    const interpreter = await this.interpreterRepository.findOneOrFail({
      id: interpreterId,
    });

    const booking = this.bookingRepository.create(createDto);
    booking.interpreter = interpreter;
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
    const { page, limit, interpreter, file, date } = paginateBookingQueryDto;

    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.interpreter', 'interpreter')
      .leftJoinAndSelect('booking.language', 'language')
      .offset((page - 1) * limit)
      .limit(limit);

    if (file) {
      query.where('booking.file like :file', { file: `%${file}%` });
    }

    if (interpreter) {
      query.andWhere(
        'interpreter.firstName like :name OR interpreter.lastName like :name',
        {
          name: `%${interpreter}%`,
        },
        // TODO more searching functionality

        // new Brackets(sqb => {
        //   sqb
        //     .where('interpreter.firstName like :name', {
        //       name: `%${interpreter}%`,
        //     })
        //     .orWhere('interpreter.lastName like :name', {
        //       name: `%${interpreter}$`,
        //     });
        // }),
      );
    }
    console.log(query.getQuery());
    const bookings = await query.getMany();

    return {
      data: bookings,
      pagination: { page, limit },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
