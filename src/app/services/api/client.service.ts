import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Client } from '../../models/client';

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  constructor(private http: HttpClient) {
  }

  getClientsPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/client_paginated?page=`+page, {  });
  }
  getClientById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/client/${id}`, { params: id });
  }

  createClient(client: Client) {
    console.log('createclient');
    let params = new HttpParams();
    Object.keys(client).forEach(key => {
      params = params.append(key, client[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/client`, params);
  }

  updateClient(id, client: Client) {
    let params = new HttpParams();
    Object.keys(client).forEach(key => {
      params = params.append(key, client[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/client/${id}`, client, { params } );
  }

  deleteClient(id) {
    console.log('destroyclient');
    return this.http.delete<any>(`${environment.apiUrl}api/client/${id}`, { params: id });
  }

}
