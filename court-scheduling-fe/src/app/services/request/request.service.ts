import { Injectable, EventEmitter} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Interpreter } from 'src/app/models/interpreter';
import { Language } from 'src/app/models/language';
import { InterpreterRequest } from 'src/app/models/request';
@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private subject = new Subject<InterpreterRequest>();

  constructor() { }

  public showNewRequestForm(interpreter: Interpreter, date: Date): void {
    const model = new InterpreterRequest(true, date, interpreter);
    this.emit(model);
  }

  public cancelRequest(): void {
    this.subject.next(null);
  }

  /**
   * Get observable to subscribe to.
   */
  public getObservable(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Emit notification to observers (app-component) that a request should be shown / removed
   */
  private emit(request: InterpreterRequest): void {
    this.subject.next(request);
  }
}
