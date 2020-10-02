import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDateDto } from './dto/booking-date.dto';
import { BookingDateEntity } from './entities/booking-date.entity';

@Injectable()
export class BookingDateService {
  constructor(
    @InjectRepository(BookingDateEntity)
    private readonly bookingDateRepository: Repository<BookingDateEntity>,
  ) {}

  async create(
    bookingDate: Partial<BookingDateDto>[],
  ): Promise<BookingDateEntity[]> {
    const bDates = await Promise.all(
      bookingDate.map(async (bDate: BookingDateDto) => {
        return this.bookingDateRepository.create(bDate);
      }),
    ).catch(function(err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });

    return await Promise.all(
      bDates.map(bDate => this.bookingDateRepository.save(bDate)),
    );
  }
}
