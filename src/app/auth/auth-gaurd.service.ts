// import { CanActivateFn } from '@angular/router';

import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";


@Injectable({providedIn: 'root'})
export class AuthGaurdService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.getLoginStatus().pipe(take(1), map((isAuthenticated) => {
      if(isAuthenticated) {
        return true;
      }else {
        return this.router.createUrlTree(['/auth']);
      }
    }))
  }
}