import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Client } from '../../models/client';
import {Attribute} from "../../models/attribute";

@Injectable({
  providedIn: 'root'
})

export class AttributeService {

  private entity='';
  constructor(private http: HttpClient) {
  }

  getAttributesPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/attribute_paginated?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getAttributeById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/attribute/${id}`, { params: id })
      .pipe(map(respons => {
        // store client details and jwt token in local storage to keep client logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createAttribute(attribute: Attribute) {
    const params = new FormData();
    Object.keys(attribute).forEach(key => {
      const name = attribute[key] as File;
      if(key ==='img') {
        params.append('img', attribute[key], name.name);
      }else {
        params.append(key, attribute[key]);
      }
    });
    return this.http.post<any>(`${environment.apiUrl}api/attribute`,  params )
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(data);
        return data;
      }));
  }
  updateAttribute(id, attribute: Attribute) {
    let params = new HttpParams();
    Object.keys(attribute).forEach(key => {
      params = params.append(key, attribute[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/attribute/${id}`, attribute, { params } );
  }
  uploadImage(id,img) {
    const formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/attribute_image/${id}`, formData );
  }
  deleteAttribute(id) {
    console.log('destroyclient');
    return this.http.delete<any>(`${environment.apiUrl}api/attribute/${id}`, { params: id });
  }

}
