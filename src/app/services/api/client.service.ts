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

  getClient() {
    console.log('getclientes');
    return this.http.get<any>(`${environment.apiUrl}api/client`, {  })
      .pipe(map(respons => {
        // store client details and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  getClientById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/client/${id}`, { params: id })
      .pipe(map(respons => {
        // store client details and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createClient(client: Client) {
    console.log('createclient');
    let params = new HttpParams();
    Object.keys(client).forEach(key => {
      params = params.append(key, client[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/client`, params)
      .pipe(map(respons => {
        // store client respons and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
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
