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

  getPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/attribute_paginated?page=`+page, {  });
  }
  getAttributeById(id) {
    console.log('getclientById');
    return this.http.get<any>(`${environment.apiUrl}api/attribute/${id}`, { params: id });
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
    return this.http.post<any>(`${environment.apiUrl}api/attribute`,  params );
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
