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
    console.log('canActivate');
    //obtenemos los roles requeridos para la ruta
    const expectedRoles = route.data.roles;
    console.log(route.data.roles);
    //si exiten roles requeridos
    if(route.data.roles){
      console.log('if(route.data.roles)');
      // comporvamos los roles del usuario con la funcion checkRoles
      // Itera sobre los roles esperados y comprueba si el usuario tiene alguno de ellos
      const isAuthorized = this.authenticationService.checkRoles(expectedRoles);
      // si no tiene ninguno redireccionamos a /
      if (!isAuthorized) {
        console.log('if (!isAuthorized)');
        this.router.navigate(['/']);
        return false;
      }
      // si tiene el rol requerido devolvemos true
      console.log('true');
      return true;
    }else{
      // si no se especifica ningun rol para la ruta
      //comporvamos que el usario ha iniciado session
      console.log('else');
      const currentUser = this.authenticationService.currentClientValue;
      if (currentUser) {
        console.log('if (currentUser)');
        //si ha iniciado session devolvemos true
        return true;
      }else {
        //sino redireccionamos a /
        console.log('}else {');
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
    console.log('canActivateChild');
    const currentUser = this.authenticationService.currentClientValue;
    console.log(currentUser);
    if (currentUser) {
      console.log('if (currentUser)');
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.roles[0].name) === -1) {
        console.log('if (route.data.roles && route.data.roles.indexOf(currentUser.roles[0].name)');
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // console.log(currentUser);
      // authorised so return true
      console.log('true');
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url }});
    console.log('false');
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
