import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminAction } from './models/admin-action';
import { Interpreter } from './models/interpreter';
import { AdminService } from './services/admin/admin.service';
import { RequestService } from './services/request/request.service';
import { ToastModel, ToastService } from './services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Court Scheduling';


  public interpreterRequest: Request;
  private requsestSubscription: Subscription;

  public adminAction: AdminAction;
  private adminActionSubscription: Subscription;

  public toastMessage: ToastModel;
  private toastSubscription: Subscription;

  constructor(
    private requestService: RequestService,
    private adminService: AdminService,
    private toastService: ToastService,
    private zone: NgZone) {
    this.subscribeToRequestService();
    this.subscribeToAdminService();
    this.subscribeToToastService();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unSubscribeToRequestService();
    this.unSubscribeToAdminService();
    this.unSubscribeFromToastService();
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
    if (!this.requsestSubscription) { return; }
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
    if (!this.adminActionSubscription) { return; }
    this.adminActionSubscription.unsubscribe();
  }

  /**
   * Subsribe to toastSetvice to be notified when a message should be displayed
   */
  private subscribeToToastService(): void {
    this.toastSubscription = this.toastService.getObservable().subscribe(model => {

      this.zone.run(() => {
        if (model && typeof model.message === typeof '') {
          this.toastMessage = model;
        } else {
          this.toastMessage = undefined;
        }
      });
    });
  }

  private unSubscribeFromToastService(): void {
    if (!this.toastSubscription) { return; }
    this.toastSubscription.unsubscribe();
  }
  /******** End Toasts ********/

}
