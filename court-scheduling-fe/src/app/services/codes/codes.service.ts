import { Injectable } from '@angular/core';
import { Court } from 'src/app/models/court';
import { Language } from 'src/app/models/language';
import { DummyService } from '../dummy/dummy.service';

@Injectable({
  providedIn: 'root'
})
export class CodesService {

  constructor(private dummy: DummyService) { }

  public async getLanguages(): Promise<Language[]> {
    return this.dummy.languages;
  }

  public async getCourts(): Promise<Court[]> {
    return this.dummy.courts;
  }

}
