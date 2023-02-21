import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Order } from '../../models/order';
import {Product} from "../../models/product";

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
  getOrderByClient(id) {
    console.log('getorderById');
    return this.http.get<any>(`${environment.apiUrl}api/order/client/${id}`, { params: id })
      .pipe(map(respons => {
        // store order details and jwt token in local storage to keep order logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createOrder2(cart:any) {
    console.log('createorder');
    let params = new HttpParams();
    Object.keys(cart).forEach(key => {
      params = params.append(key, cart[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/order`, params)
      .pipe(map(respons => {
        // store order respons and jwt token in local storage to keep order logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createOrder(cart: any, clientId:any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(`${environment.apiUrl}api/order`, {cart:cart,client_id:clientId}, httpOptions);
  }
  paymentIntent(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(`${environment.apiUrl}/payment-intent`, data, httpOptions)
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
