import { Component, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Court } from 'src/app/models/court';
import { Interpreter } from 'src/app/models/interpreter';
import { InterpretersService } from 'src/app/services/interpreters/interpreters.service';
import { CodesService } from 'src/app/services/codes/codes.service';
import { RequestService } from 'src/app/services/request/request.service';

@Component({
  selector: 'app-interpreters',
  templateUrl: './interpreters.component.html',
  styleUrls: ['./interpreters.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class InterpretersComponent implements OnInit {

  // Variables
  selectedDate: Date = new Date();

  // Dropdowns
  statuses: string[] = ['Booked', 'Pending'];
  languages: Language[] = [];
  courtLocations: Court[] = [];

  // Table
  dataSource: Interpreter[] = [];
  expandedElement: Interpreter | null;
  columnsToDisplay = ['name', 'level', 'phone', 'emailAddress', 'bookingsInTheLastDays'];
  tableDef: Array<any> = [
    {
      key: 'name',
      header: 'Name',
    },    {
      key: 'level',
      header: 'Level',
    },    {
      key: 'phone',
      header: 'Phone',
    },    {
      key: 'emailAddress',
      header: 'Email address',
    },    {
      key: 'bookingsInTheLastDays',
      header: 'Bookings in the last 30 days',
    },
  ];

  constructor(
              private interpretersService: InterpretersService,
              private codesService: CodesService,
              private requestService: RequestService) { }

  ngOnInit(): void {
    this.fetchAllInterpreters();
    this.fetchCodes();
  }

  async fetchAllInterpreters(): Promise<void> {
    this.dataSource = await this.interpretersService.getInterpreters();
  }

  async fetchCodes(): Promise<void> {
    this.courtLocations = await this.codesService.getCourts();
    this.languages = await this.codesService.getLanguages();
  }

  showRequestForm(forInterpreter: Interpreter): void {
    this.requestService.showNewRequestForm(forInterpreter, this.selectedDate);
  }
}
