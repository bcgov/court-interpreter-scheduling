import { Component, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Court } from 'src/app/models/court';
import { Interpreter } from 'src/app/models/interpreter';

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

  languages: Language[] = [
    {id: `farsi`, name: `Farsi`},
    {id: `french`, name: `French`},
    {id: `italian`, name: `Italian`}
  ];

  courtLocations: Court[] = [
    {id: `victoria`, name: `Victoria`},
    {id: `vancouver`, name: `Vancouver`},
    {id: `nanaimo`, name: `Nanaimo`}
  ];

  dataSource: Interpreter[] = ELEMENT_DATA;
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
  ]
  expandedElement: Interpreter | null;

  constructor() { }

  ngOnInit(): void {
  }

}

const ELEMENT_DATA: Interpreter[] = [
  {
    id: '1',
    name: 'Ella Beck',
    level: '2',
    phone: '+1604.333.4567',
    emailAddress: 'ella_beck@cameron.net',
    bookingsInTheLastDays: '2'
  }, {
    id: '2',
    name: 'Ella Beck',
    level: '2',
    phone: '+1604.333.4567',
    emailAddress: 'ella_beck@cameron.net',
    bookingsInTheLastDays: '2'
  }, {
    id: '3',
    name: 'Ella Beck',
    level: '2',
    phone: '+1604.333.4567',
    emailAddress: 'ella_beck@cameron.net',
    bookingsInTheLastDays: '2'
  }, {
    id: '4',
    name: 'Ella Beck',
    level: '2',
    phone: '+1604.333.4567',
    emailAddress: 'ella_beck@cameron.net',
    bookingsInTheLastDays: '2'
  }, {
    id: '5',
    name: 'Ella Beck',
    level: '2',
    phone: '+1604.333.4567',
    emailAddress: 'ella_beck@cameron.net',
    bookingsInTheLastDays: '2'
  }, {
    id: '6',
    name: 'Ella Beck',
    level: '2',
    phone: '+1604.333.4567',
    emailAddress: 'ella_beck@cameron.net',
    bookingsInTheLastDays: '2'
  },
];
