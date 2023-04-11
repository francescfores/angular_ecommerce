import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Category } from '../../models/category';
import {Product} from "../../models/product";
import {SubCategory} from "../../models/subcategory";
import {SuperCategory} from "../../models/supercategory";
import {Client} from "../../models/client";
import {Cart} from "../../models/cart";
import {Address} from "../../models/address";

@Injectable({
  providedIn: 'root'
})

export class AddressService {

  constructor(private http: HttpClient) {
  }

  getRates() {
    return this.http.get<any>(`${environment.apiUrl}api/shippypro/rates`);
  }

  getContries() {
    return this.http.get<any>(`${environment.apiUrl}api/countries`);
  }


  validAddress(category) {
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/shippypro/valid_address`, params);
  }

  getAllByClient() {
    return this.http.get<any>(`${environment.apiUrl}api/client/{id}/address/`, {  });
  }

  getByClient(id) {
    console.log('getaddressById');
    return this.http.get<any>(`${environment.apiUrl}api/client/{id}/address/${id}`, { params: id });
  }

  createByClient(address: Address) {
    console.log('createaddress');
    let params = new HttpParams();
    Object.keys(address).forEach(key => {
      params = params.append(key, address[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/client/{id}/address/`, params);
  }

  update(id, address: Address) {
    let params = new HttpParams();
    Object.keys(address).forEach(key => {
      params = params.append(key, address[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/address/${id}`, address, { params } );
  }

  delete(id) {
    console.log('destroyaddress');
    return this.http.delete<any>(`${environment.apiUrl}api/address/${id}`, { params: id });
  }
}
