import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Category } from '../../models/category';
import {Product} from "../../models/product";
import {SubCategory} from "../../models/subcategory";
import {SuperCategory} from "../../models/supercategory";
import {Payment} from "../../models/payment";

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  private entity='payment';
  constructor(private http: HttpClient) {
  }

  getPaymentsPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/`+this.entity+`_paginated?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getPaymentById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/`+this.entity+`/${id}`, { params: id })
      .pipe(map(respons => {
        // store client details and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }
  updatePayment(id, attribute: Payment) {
    let params = new HttpParams();
    Object.keys(attribute).forEach(key => {
      params = params.append(key, attribute[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/`+this.entity+`/${id}`, attribute, { params } );
  }
  deletePayment(id) {
    console.log('destroyclient');
    return this.http.delete<any>(`${environment.apiUrl}api/`+this.entity+`/${id}`, { params: id });
  }

  updateStatus(id, status) {
    let params = new HttpParams();
    console.log(status)
    params = params.append('status', status);
    return this.http.put<any>(`${environment.apiUrl}api/`+this.entity+`_update_status/${id}`, status, { params } );
  }

}
