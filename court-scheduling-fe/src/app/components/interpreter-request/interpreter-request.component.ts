import { Component, Input, OnInit } from '@angular/core';
import { Court } from 'src/app/models/court';
import { Language } from 'src/app/models/language';
import { InterpreterRequest } from 'src/app/models/request';
import { CodesService } from 'src/app/services/codes/codes.service';
import { InterpretersService } from 'src/app/services/interpreters/interpreters.service';
import { RequestService } from 'src/app/services/request/request.service';

@Component({
  selector: 'app-interpreter-request',
  templateUrl: './interpreter-request.component.html',
  styleUrls: ['./interpreter-request.component.css']
})
export class InterpreterRequestComponent implements OnInit {

  // Inputs
  @Input() request: InterpreterRequest = null;

  // Dropdowns
  statuses: string[] = ['Booked', 'Pending'];
  languages: Language[] = [];
  courtLocations: Court[] = [];

  constructor(
    private interpretersService: InterpretersService,
    private codesService: CodesService,
    private requestService: RequestService) { }

  ngOnInit(): void {
    this.fetchCodes();
  }

  async fetchCodes(): Promise<void> {
    this.courtLocations = await this.codesService.getCourts();
    this.languages = await this.codesService.getLanguages();
  }

  closeRequest(): void {
    this.requestService.cancelRequest();
  }
}
