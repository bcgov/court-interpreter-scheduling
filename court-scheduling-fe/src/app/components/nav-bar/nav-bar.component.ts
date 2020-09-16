import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/app-routes';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
  }

  navigateTo($event): void {
    switch ($event.index) {
      case 0: {
        this.goToBookings();
        break;
      }
      case 1: {
        this.goToInterpreteres();
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

  goToInterpreteres(): void {
    this.routerService.navigateTo(AppRoutes.Interpreters);
  }

  goToClerks(): void {
    this.routerService.navigateTo(AppRoutes.Clerks);
  }
}
