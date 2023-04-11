import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Order } from '../../models/order';
import {Product} from '../../models/product';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) {
  }

  get() {
    return this.http.get<any>(`${environment.apiUrl}api/order`, {  })
  }
  getPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/order_paginated?page=`+page, {  })
  }
  getOrderById(id) {
    return this.http.get<any>(`${environment.apiUrl}api/order/${id}`, { params: id })
  }
  getOrderByClient(id) {
    return this.http.get<any>(`${environment.apiUrl}api/order/client/${id}`, { params: id })
  }
  getOrderByClientPaginated(id, page) {
    return this.http.get<any>(`${environment.apiUrl}api/client/${id}/order_paginated?page=${page}`)
  }
  getBetweenDate(date_start,date_end) {
    let params = new HttpParams();
    params = params.append('date_start', date_start);
    params = params.append('date_end', date_end);

    return this.http.post<any>(`${environment.apiUrl}api/order_between_date`, params)
  }
  createOrder2(cart:any) {
    let params = new HttpParams();
    Object.keys(cart).forEach(key => {
      params = params.append(key, cart[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/order`, params)
  }

  createOrder(cart: any, clientId:any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(`${environment.apiUrl}api/order`, {cart,client_id:clientId}, httpOptions);
  }

  paymentIntent(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(`${environment.apiUrl}/payment-intent`, data, httpOptions)
  }

  updateOrder(id, order: Order) {
    let params = new HttpParams();
    Object.keys(order).forEach(key => {
      params = params.append(key, order[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/order/${id}`, order, { params } );
  }

  updateStatus(id, status) {
    let params = new HttpParams();
    params = params.append('status', status);
    return this.http.put<any>(`${environment.apiUrl}api/order_update_status/${id}`, status, { params } );
  }


  deleteOrder(id) {
    return this.http.delete<any>(`${environment.apiUrl}api/order/${id}`, { params: id });
  }


  // TODO create service return
  createReturn(returnOrder: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(`${environment.apiUrl}api/return`, {returnOrder}, httpOptions);
  }

  getReturnByClientPaginated(id, page) {
    return this.http.get<any>(`${environment.apiUrl}api/client/${id}/return_paginated?page=${page}`)
  }

  getReturnPaginated( page) {
    return this.http.get<any>(`${environment.apiUrl}api/return_paginated?page=${page}`)
  }
}
