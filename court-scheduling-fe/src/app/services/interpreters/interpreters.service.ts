import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/constants/constants';
import { Court } from 'src/app/models/court';
import { Interpreter } from 'src/app/models/interpreter';
import { Language } from 'src/app/models/language';
import { APIRequestMethod, ApiService } from '../api/api.service';
import { DummyService } from '../dummy/dummy.service';

@Injectable({
  providedIn: 'root'
})
export class InterpretersService {

  constructor(private dummy: DummyService, private api: ApiService) { }

  /**
   * Get all interpreters
   */
  public async getInterpreters(): Promise<Interpreter[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_INTERPRETER, null);
    console.log(response.response);
    // TODO: API Call
    return response.response;
    return this.dummy.interpreters(20);
  }

  /**
   * Get interpreter by ID
   * @param id id of interpreter
   */
  public async getInterpreter(id: string): Promise<Interpreter> {
    // TODO: API Call
    return this.dummy.interpreters(1)[0];
  }

  public async search(language?: Language, location?: Court, levels?: number[], date?: Date): Promise<Interpreter[]> {
    // TODO: Remove
    console.log('Search params:');
    console.log(language);
    console.log(location);
    console.log(levels);
    console.log(date);

    // TODO: API Call
    let result = this.dummy.interpreters(20);
    if (levels && levels.length > 0) {
      result = result.filter(interpreter => levels.includes(interpreter.level));
    }

    // Sort by # of bookings
    const sorted = result.sort((a, b) => a.bookingsInTheLastDays - b.bookingsInTheLastDays);
    return sorted;
  }

}