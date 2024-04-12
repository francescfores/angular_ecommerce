import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Client } from '../../models/client';
import {Router} from '@angular/router';
import {SocialAuthService} from "@abacritt/angularx-social-login";
import {Category} from "../../models/category";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentClientSubject: BehaviorSubject<Client>;
  public currentClient: Observable<Client>;
  public user: Client;

  constructor(private http: HttpClient, private router: Router,  private socialAuthService: SocialAuthService
  ) {
    this.currentClientSubject = new BehaviorSubject<Client>(JSON.parse(localStorage.getItem('currentClient')));
    this.currentClient = this.currentClientSubject.asObservable();
  }

  public get currentClientValue(): any  {
    return this.currentClientSubject.value;
  }

  login(email, password) {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');
    headers.append('Access-Control-Allow-Headers','X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    const httpOptions = {
      headers,
    };
    return this.http.post<any>(`${environment.apiUrl}api/login_client`, { email, password })
      // return this.http.post<any>(`$/users/authenticate`, { username, password })
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.user = data.client;
        this.user.token = data.token;
        localStorage.setItem('currentClient', JSON.stringify(this.user));
        const cartJson = localStorage.getItem('cart');
        console.log('cartJson',cartJson);
        this.currentClientSubject.next(this.user);
        return this.user;
      }));
  }
  loginUser(email, password) {
    console.log(email);
    console.log(password);
    console.log('cors');
    console.log(environment.apiUrl);
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Access-Control-Allow-Headers','X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    headers.append('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    headers.append('Allow','GET, POST, OPTIONS, PUT, DELETE');
    const httpOptions = {
      headers,
    };
    return this.http.post<any>(`${environment.apiUrl}api/login`, { email, password }, httpOptions)
      // return this.http.post<any>(`$/users/authenticate`, { username, password })
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log('login');
        this.user = data.user;
        this.user.token = data.token;
        localStorage.setItem('currentClient', JSON.stringify(this.user));
        this.currentClientSubject.next(this.user);
        return this.user;
      }));
  }
  loginGoogle(email, id_token) {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Access-Control-Allow-Headers','X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    headers.append('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    headers.append('Allow','GET, POST, OPTIONS, PUT, DELETE');
    const httpOptions = {
      headers,
    };
    return this.http.post<any>(`${environment.apiUrl}api/login_client_google`, { email, id_token }, httpOptions)
      // return this.http.post<any>(`$/users/authenticate`, { username, password })
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log('login');
        this.user = data.client;
        this.user.token = data.token;
        localStorage.setItem('currentClient', JSON.stringify(this.user));
        this.currentClientSubject.next(this.user);
        return this.user;
      }));
  }
  logout() {
    console.log('logout');
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentClient');
    localStorage.removeItem('cart');
    localStorage.clear();
    // if ( this.currentClientSubject.value.businesses.length > 0 ) {
    //   localStorage.removeItem('business');
    //   console.log('removeItem');
    //
    // }
    this.currentClientSubject.next(null);
    this.socialAuthService.signOut();
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '' }});
  }

  checkRoles(expectedRoles: string[]): boolean {
    let isAuthorized = false;
    const userRoles = this.getRoles();

    // Itera sobre los roles esperados y comprueba si el usuario tiene alguno de ellos
    expectedRoles.forEach(role => {
      if (userRoles.indexOf(role) > -1) {
        isAuthorized = true;
      }
    });

    return isAuthorized;
  }

  getRoles(): string[] {
    // Obtiene los roles del usuario desde el objeto currentClientValue
    const userRoles = this.currentClientValue.roles;
    return userRoles ? userRoles.map(role => role.name) : [];
  }

  register(data: any) {
    const params = new FormData();
    Object.keys(data).forEach(key => {
        params.append(key, data[key]);
    });
    console.log('params');
    console.log(params);
    return this.http.post<any>(`${environment.apiUrl}api/register_client`,  params )
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.user = data.user;
        this.user.token = data.token;
        localStorage.setItem('currentClient', JSON.stringify(this.user));
        const cartJson = localStorage.getItem('cart');
        console.log('cartJson',cartJson);
        this.currentClientSubject.next(this.user);
        return this.user;
      }));;
  }
}
