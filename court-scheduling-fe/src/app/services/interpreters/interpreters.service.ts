import { Injectable } from '@angular/core';
import { Interpreter } from 'src/app/models/interpreter';
import { DummyService } from '../dummy/dummy.service';

@Injectable({
  providedIn: 'root'
})
export class InterpretersService {

  constructor(private dummy: DummyService) { }

  public async getInterpreters(): Promise<Interpreter[]> {
    return this.dummy.interpreters(10);
  }

  public async getInterpreter(id: string): Promise<Interpreter> {
    return this.dummy.interpreters[0];
  }

}
