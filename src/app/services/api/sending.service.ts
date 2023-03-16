import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Client } from '../../models/client';
import {Sending} from "../../models/sending";

@Injectable({
  providedIn: 'root'
})

export class SendingService {

  constructor(private http: HttpClient) {
  }

  getSendingsPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/sending_paginated?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getSendingById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/sending/${id}`, { params: id })
      .pipe(map(respons => {
        // store client details and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  updateSending(id, client: Sending) {
    let params = new HttpParams();
    Object.keys(client).forEach(key => {
      params = params.append(key, client[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/sending/${id}`, client, { params } );
  }
  updateStatus(id, status) {
    let params = new HttpParams();
    console.log(status)
    params = params.append('status', status);
    return this.http.put<any>(`${environment.apiUrl}api/sending_update_status/${id}`, status, { params } );
  }
  deleteSending(id) {
    console.log('destroyclient');
    return this.http.delete<any>(`${environment.apiUrl}api/sending/${id}`, { params: id });
  }

}
