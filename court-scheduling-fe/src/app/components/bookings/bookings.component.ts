import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/booking';
import { Court } from 'src/app/models/court';
import { Language } from 'src/app/models/language';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { CodesService } from 'src/app/services/codes/codes.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { InterpretersService } from 'src/app/services/interpreters/interpreters.service';
import { Interpreter } from 'src/app/models/interpreter';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BookingsComponent implements OnInit {

  dataSource: Booking[] = [];
  languages: Language[] = [];
  courtLocations: Court[] = [];

  showInterpreterDetail = false;
  interpreterToShow: Interpreter = null;

  expandedElement: Booking | null;
  columnsToDisplay = ['date', 'courtFileNumber', 'caseName', 'interpreterName', 'isBooked', 'comments'];
  tableDef: Array<any> = [
    {
      key: 'date',
      header: 'Date & Time',
    },    {
      key: 'courtFileNumber',
      header: 'Court File Number',
    },    {
      key: 'caseName',
      header: 'Case Name',
    },    {
      key: 'interpreterName',
      header: 'Interpreter',
    },    {
      key: 'isBooked',
      header: 'Status',
    },    {
      key: 'comments',
      header: 'comments',
    },
  ];

  constructor(
    private codesService: CodesService,
    private bookingService: BookingsService,
    private intepreterService: InterpretersService) { }

  ngOnInit(): void {
    this.fetchCodes();
    this.fetchAllBookings();
  }

  async fetchAllBookings(): Promise<void> {
    this.dataSource = await this.bookingService.getBookings();
  }

  async fetchCodes(): Promise<void> {
    this.courtLocations = await this.codesService.getCourts();
    this.languages = await this.codesService.getLanguages();
  }

  async showInterpreter(forBooking: Booking): Promise<void>  {
    this.interpreterToShow = await this.intepreterService.getInterpreter(forBooking.interpreterId);
    console.log(this.interpreterToShow);
    this.showInterpreterDetail = true;
  }

  closeInterpreter(): void {
    this.showInterpreterDetail = false;
  }

}
