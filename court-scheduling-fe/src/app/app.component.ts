import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminAction } from './models/admin-action';
import { Interpreter } from './models/interpreter';
import { AdminService } from './services/admin/admin.service';
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

  public adminAction: AdminAction;
  private adminActionSubscription: Subscription;

  constructor(private requestService: RequestService, private adminService: AdminService) {
    this.subscribeToRequestService();
    this.subscribeToAdminService();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unSubscribeToRequestService();
    this.unSubscribeToAdminService();
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

  /**
   * Subsribe to requestService to be notified when the request modal should be shown.
   */
  private subscribeToAdminService(): void {
    this.adminActionSubscription = this.adminService.getObservable().subscribe(action => {
      if (action) {
        this.adminAction = action;
      } else {
        this.adminAction = undefined;
      }
    });
  }

  private unSubscribeToAdminService(): void {
    if (!this.adminActionSubscription) {return; }
    this.adminActionSubscription.unsubscribe();
  }
}
