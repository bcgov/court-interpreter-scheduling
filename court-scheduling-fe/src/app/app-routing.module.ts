import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './app-routes';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ClerksComponent } from './components/clerks/clerks.component';
import { InterpretersComponent } from './components/interpreters/interpreters.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: AppRoutes.Login, component: LoginComponent},
  // { path: AppRoutes.Root, component: },
  { path: AppRoutes.Bookings, component: BookingsComponent},
  { path: AppRoutes.Interpreters , component: InterpretersComponent },
  { path: AppRoutes.Clerks, component: ClerksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
