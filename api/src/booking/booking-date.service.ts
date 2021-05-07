import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isSameBookingDate } from 'src/utils';
import {  Repository } from 'typeorm';

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

  async removeByBookings(bookingDates: BookingDateEntity[]): Promise<BookingDateEntity[]> {
    return this.bookingDateRepository.remove(bookingDates);
  }

  /**
   * common booking dates, do nothing:
   * deleted booking dates, delete from database:
   * new booking dates, insert to database:
   * @param oldBookingDates 
   * @param newBookingDates 
   */
  async upsert(oldBookingDates: BookingDateEntity[], newBookingDates: BookingDateDto[]) {
    let common: BookingDateEntity[] = [];
    let deleted: BookingDateEntity[] = [];
    let newInsert: BookingDateDto[] = [...newBookingDates];
    oldBookingDates.forEach(old => {
      const commonNewBookingDate = newBookingDates.find(n => isSameBookingDate(old, n));
      if(commonNewBookingDate) {
        common = [...common, old];
        newInsert = newInsert.filter(n => n !== commonNewBookingDate);
      } else {
        deleted = [...deleted, old];
      }
    })
    
    const deletedBookingDates = await this.removeByBookings(deleted);
    const newInsertedBookingDates = await this.create(newInsert);
    
    return { deletedBookingDates, newInsertedBookingDates, commonBookingDates: common };
  }
}
