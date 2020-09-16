import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoutes } from 'src/app/app-routes';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) {}

  public async navigateTo(route: AppRoutes, id?: string): Promise<void> {
    if (id != null && id != undefined) {
      const routeWithId = route.replace(`:id`, `${id}`);
      this.router.navigate([routeWithId]);
    } else {
      this.router.navigate([route]);
    }
  }

  public get current(): AppRoutes {
    const current = this.router.url.substring(1);
    // is it a route with params
    if (current.indexOf(`/`) !== -1) {
      const origin = current.slice(0, current.lastIndexOf(`/`));
      const genericOrigin = `${origin}/:id`;
      const result = this.stringToEnumRoute(genericOrigin);
      return result;
    } else {
      // Route with no params
      return this.stringToEnumRoute(current);
    }
  }

  public get routeId(): string | undefined {
    const current = this.router.url.substring(1);
    if (current.indexOf(`/`) !== -1) {
      const id = current.slice(current.lastIndexOf(`/`) + 1);
      return id;
    } else {
      return;
    }
  }

  private stringToEnumRoute(s: string): AppRoutes | undefined {
    for (const value of Object.keys(AppRoutes)) {
      if (AppRoutes[value] === s) {
        return AppRoutes[value];
      }
    }
    return undefined;
  }
}
