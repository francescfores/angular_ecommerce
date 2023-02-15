import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthenticationService } from '../api/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data.roles;
    console.log(route.data.roles);
    if(route.data.roles){
      const isAuthorized = this.authenticationService.checkRoles(expectedRoles);

      if (!isAuthorized) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }else{
      const currentUser = this.authenticationService.currentClientValue;
      if (currentUser) {
          return true;
      }else {
        this.router.navigate(['/']);
      }
    }
  }

  canActivate2(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
    const currentUser = this.authenticationService.currentClientValue;
    console.log('canActivate');
    console.log(currentUser.roles[0]);
    console.log(route.data.roles);
    console.log(route.data.roles.indexOf(currentUser.roles[0].name));
    if (currentUser) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.roles[0].name) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url }});
    console.log('false');
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentClientValue;
    if (currentUser) {
      console.log(currentUser);
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.roles[0].name) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // console.log(currentUser);
      // authorised so return true
      // console.log('true');
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url }});
    // console.log('false');
    return false;
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //   return true;
  // }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //   return true;
  // }
}
