import { Injectable } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { DummyService } from '../dummy/dummy.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private dummy: DummyService) { }

  public async getBookings(): Promise<Booking[]> {
    return this.dummy.bookings(10);
  }

}
