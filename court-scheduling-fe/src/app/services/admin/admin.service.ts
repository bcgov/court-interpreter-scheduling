import { Injectable, EventEmitter} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AppConstants } from 'src/app/constants/constants';
import { AdminAction } from 'src/app/models/admin-action';
import { Interpreter } from 'src/app/models/interpreter';
import { APIRequestMethod, ApiService } from '../api/api.service';
import { InterpretersService } from '../interpreters/interpreters.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private subject = new Subject<AdminAction>();

  constructor(private api: ApiService) { }

  public async addNewInterpreter(model: Interpreter): Promise<boolean> {
    const body = JSON.parse(JSON.stringify(model));
    console.log('requesting');
    console.log(body);
    const response = await this.api.request(APIRequestMethod.POST, AppConstants.API_INTERPRETER, body);
    console.log(response);
    console.log(response.success);
    return response && response.success === true;
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
