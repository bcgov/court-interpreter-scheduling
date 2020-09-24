import { Component, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Court } from 'src/app/models/court';
import { Interpreter } from 'src/app/models/interpreter';
import { InterpretersService } from 'src/app/services/interpreters/interpreters.service';
import { CodesService } from 'src/app/services/codes/codes.service';
import { RequestService } from 'src/app/services/request/request.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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

  // Search Variables
  selectedDate: Date = new Date();
  selectedLanguage = '';
  selectedLocation = '';
  levels = [
    {name: '1', selected: false},
    {name: '2', selected: false},
    {name: '3', selected: false},
    {name: '4', selected: false}
  ];
  selectedLevels: number[] = [];

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

  // Search
  async search(): Promise<void> {
    const language = this.languages.find(item => item.name === this.selectedLanguage);
    const location = this.courtLocations.find(item => item.name === this.selectedLocation);
    const selectedLevels = this.levels.filter(level => level.selected);
    const lvls: number[] = selectedLevels.map(level => +level.name);
    this.dataSource = await this.interpretersService.search(language, location, lvls, this.selectedDate);
  }

  /**
   * Sets selectedLanguage on dropdown change
   * @param event new selection event
   */
  languageSelectionChanged(event: MatSelectChange): void {
    const selectedOption = this.languages.find(item => item.name === event.value);
    this.selectedLanguage = selectedOption.name;
    console.log(this.selectedLanguage);
  }

  /**
   * Sets selectedLocation on dropdown change
   * @param event new selection event
   */
  locationSelectionChanged(event: MatSelectChange): void {
    const selectedOption = this.courtLocations.find(item => item.name === event.value);
    this.selectedLocation = selectedOption.name;
    console.log(this.selectedLocation);
  }

  dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (this.selectedDate !== event.value) {
        this.selectedDate = event.value;
    }
  }
}
