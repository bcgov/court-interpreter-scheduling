import { Injectable, EventEmitter} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AdminAction } from 'src/app/models/admin-action';
import { Interpreter } from 'src/app/models/interpreter';
import { InterpretersService } from '../interpreters/interpreters.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private subject = new Subject<AdminAction>();

  constructor() { }

  public async addNewInterpreter(model: Interpreter): Promise<boolean> {
    
  }

  /**
   * Show add interpreter modal
   */
  public showAddIntepreter(): void {
    this.emit(AdminAction.AddInterpreter);
  }

  /**
   * Close action
   */
  public closeAction(): void {
    this.subject.next(null);
  }

  /**
   * Get observable to subscribe to.
   */
  public getObservable(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Emit notification to observers (app-component) that an action modal should be shown / removed
   */
  private emit(request: AdminAction): void {
    this.subject.next(request);
  }
}
