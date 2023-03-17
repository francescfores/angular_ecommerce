import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Client } from '../../models/client';
import {Carrier} from "../../models/carrier";

@Injectable({
  providedIn: 'root'
})

export class CarrierService {

  private entity='';
  constructor(private http: HttpClient) {
  }

  getCarriers() {
    return this.http.get<any>(`${environment.apiUrl}api/carrier`, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }

  getCarriersPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/carrier_paginated?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getCarrierById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/carrier/${id}`, { params: id })
      .pipe(map(respons => {
        // store client details and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createCarrier(carrier: Carrier) {
    const params = new FormData();
    Object.keys(carrier).forEach(key => {
      const name = carrier[key] as File;
      if(key ==='img') {
        params.append('img', carrier[key], name.name);
      }else {
        params.append(key, carrier[key]);
      }
    });
    return this.http.post<any>(`${environment.apiUrl}api/carrier`,  params )
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(data);
        return data;
      }));
  }
  updateCarrier(id, carrier: Carrier) {
    let params = new HttpParams();
    Object.keys(carrier).forEach(key => {
      params = params.append(key, carrier[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/carrier/${id}`, carrier, { params } );
  }
  uploadImage(id,img) {
    const formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/carrier_image/${id}`, formData );
  }
  deleteCarrier(id) {
    console.log('destroyclient');
    return this.http.delete<any>(`${environment.apiUrl}api/carrier/${id}`, { params: id });
  }

}