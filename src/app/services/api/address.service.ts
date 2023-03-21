import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Category } from '../../models/category';
import {Product} from "../../models/product";
import {SubCategory} from "../../models/subcategory";
import {SuperCategory} from "../../models/supercategory";

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
    return this.http.get<any>(`${environment.apiUrl}api/address/getCountries`);
  }


  validAddress(category) {
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/shippypro/valid_address`, params);
  }
}
