import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Interpreter } from './models/interpreter';
import { RequestService } from './services/request/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, OnDestroy {
  title = 'Court Scheduling';


  public interpreterRequest: Request;
  private requsestSubscription: Subscription;

  constructor(private requestService: RequestService) {
    this.subscribeToRequestService();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unSubscribeToRequestService();
  }

  /**
   * Subsribe to requestService to be notified when the request modal should be shown.
   */
  private subscribeToRequestService(): void {
    this.requsestSubscription = this.requestService.getObservable().subscribe(request => {
      if (request) {
        this.interpreterRequest = request;
      } else {
        this.interpreterRequest = undefined;
      }
    });
  }

  private unSubscribeToRequestService(): void {
    if (!this.requsestSubscription) {return; }
    this.requsestSubscription.unsubscribe();
  }
}
