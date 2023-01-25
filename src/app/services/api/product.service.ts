import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient,  HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProduct() {
    console.log('getproductes');
    return this.http.get<any>(`${environment.apiUrl}api/product`, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  getProductById(id) {
    console.log('getproductById');
    return this.http.get<any>(`${environment.apiUrl}api/product/${id}`, { params: id })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createProduct(product: Product, federationId, typeId, stateId) {
    let params = new HttpParams();
    Object.keys(product).forEach(key => {
      params = params.append(key, product[key]);
    });
    params = params.append('federationId', federationId);
    params = params.append('typeId', typeId);
    params = params.append('stateId', stateId);

    return this.http.post<any>(`${environment.apiUrl}api/product`,  params )
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(data);
        return data;
      }));
  }

  updateProduct(id, product: Product) {
    let params = new HttpParams();
    Object.keys(product).forEach(key => {
      params = params.append(key, product[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/product/${id}`, product, { params } );
  }

  deleteProduct(id) {
    console.log('destroyproduct');
    return this.http.delete<any>(`${environment.apiUrl}api/product/${id}`, { params: id });
  }

}
