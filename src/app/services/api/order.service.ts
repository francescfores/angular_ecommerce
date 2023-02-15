import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Order } from '../../models/order';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) {
  }

  getOrdersPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/order_paginated?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getOrderById(id) {
    console.log('getorderById');
    return this.http.get<any>(`${environment.apiUrl}api/order/${id}`, { params: id })
      .pipe(map(respons => {
        // store order details and jwt token in local storage to keep order logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createOrder(order: Order) {
    console.log('createorder');
    let params = new HttpParams();
    Object.keys(order).forEach(key => {
      params = params.append(key, order[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/order`, params)
      .pipe(map(respons => {
        // store order respons and jwt token in local storage to keep order logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  updateOrder(id, order: Order) {
    let params = new HttpParams();
    Object.keys(order).forEach(key => {
      params = params.append(key, order[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/order/${id}`, order, { params } );
  }

  deleteOrder(id) {
    console.log('destroyorder');
    return this.http.delete<any>(`${environment.apiUrl}api/order/${id}`, { params: id });
  }

}
