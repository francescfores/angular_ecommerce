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

  private provincesUrl = 'assets/data/provinces.json';


  constructor(private http: HttpClient) {
  }

  getRates() {
    console.log('getcategoryById');
    return this.http.get<any>(`${environment.apiUrl}api/shippypro/rates`)
      .pipe(map(respons => {
        // store category details and jwt token in local storage to keep category logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  getContries() {
    console.log('getcategoryById');
    return this.http.get<any>(`${environment.apiUrl}api/address/getCountries`)
      .pipe(map(respons => {
        // store category details and jwt token in local storage to keep category logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }


  validAddress(category) {
    console.log('validAddress');
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/shippypro/valid_address`, params)
      .pipe(map(respons => {
        // store category respons and jwt token in local storage to keep category logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }
}
