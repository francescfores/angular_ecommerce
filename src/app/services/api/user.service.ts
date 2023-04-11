import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}api/user`, {  });
  }

  paginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/user_paginated?page=`+page, {  });
  }

  get(id) {
    console.log('getuserById');
    return this.http.get<any>(`${environment.apiUrl}api/user/${id}`, { params: id });
  }

  create(user: User) {
    console.log('createuser');
    let params = new HttpParams();
    Object.keys(user).forEach(key => {
      params = params.append(key, user[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/user`, params);
  }

  update(id, user: User) {
    let params = new HttpParams();
    Object.keys(user).forEach(key => {
      params = params.append(key, user[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/user/${id}`, user, { params } );
  }

  delete(id) {
    console.log('destroyuser');
    return this.http.delete<any>(`${environment.apiUrl}api/user/${id}`, { params: id });
  }

  getAllRoles() {
    return this.http.get<any>(`${environment.apiUrl}api/role`, {  });
  }
}
