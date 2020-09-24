import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/app-routes';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  get selectedIndex(): number {
     return this.tabIndex();
 }

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
  }

  /**
   * Called when tab value changes to navigate to appropriate route
   * @param $event containing index
   */
  navigateTo($event): void {
    switch ($event.index) {
      case 0: {
        this.goToBookings();
        break;
      }
      case 1: {
        this.goToInterpreters();
        break;
      }
      case 2: {
        this.goToClerks();
        break;
      }
      default: {
        break;
      }
    }
  }

  goToBookings(): void {
    this.routerService.navigateTo(AppRoutes.Bookings);
  }

  goToInterpreters(): void {
    this.routerService.navigateTo(AppRoutes.Interpreters);
  }

  // TODO: clerks tab is not in scope yet
  goToClerks(): void {
    this.routerService.navigateTo(AppRoutes.Clerks);
  }

  goToAdmin(): void {
    this.routerService.navigateTo(AppRoutes.Admin);
  }

  /**
   * Convert current route to corresponding tab index
   */
  tabIndex(): number {
    switch (this.routerService.current) {
      case AppRoutes.Bookings: {
        return 0;
      }
      case AppRoutes.Interpreters: {
        return 1;
      }
      case AppRoutes.Clerks: {
        return 2;
      }
      default: {
        return 3;
      }
    }
  }
}
