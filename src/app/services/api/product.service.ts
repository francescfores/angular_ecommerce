import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProducts() {
    return this.http.get<any>(`${environment.apiUrl}api/product`, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }

  getProductsPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/product?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getProductsById(page) {
    return this.http.get<any>(`${environment.apiUrl}api/product?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getAttributes() {
    return this.http.get<any>(`${environment.apiUrl}api/attribute`, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }

  getCategories() {
    return this.http.get<any>(`${environment.apiUrl}api/product_category`, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }

  getProductById(id) {
    console.log('getproductById');
    return this.http.get<any>(`${environment.apiUrl}api/product/`+id)
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  createProduct(product: Product) {
    let params = new FormData();
    Object.keys(product).forEach(key => {
      const name = product[key] as File;

      if(key ==='img') {
        console.log(key);
        console.log(product[key]);

        params.append('img', product[key], name.name);
      }else {
        params.append(key, product[key]);

      }
    });
     params.append('category', product.category);
    return this.http.post<any>(`${environment.apiUrl}api/product`,  params )
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(data);
        return data;
      }));
  }
  createProductVariations(product: Product) {
    let params = new FormData();
    Object.keys(product).forEach(key => {
      const name = product[key] as File;
      if(key ==='img') {
        console.log(key);
        console.log(product[key]);
        params.append('img', product[key], name.name);
      }else {
        params.append(key, product[key]);
      }
    });
    params.append('category', product.category);
    //params.append('variations', product.variations);
    console.log(product.variations[0]);
    console.log(product.variations);
    return this.http.post<any>(`${environment.apiUrl}api/product`,  params )
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(data);
        return data;
      }));
  }

  addProduct(product: Product) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(`${environment.apiUrl}api/product`, product, httpOptions);
  }
  addProduct2(product: Product) {
    let formData = new FormData();
    Object.keys(product).forEach(key => {
      const name = product[key] as File;
      if(key ==='img') {
        console.log(key);
        console.log(product[key]);
        formData.append('img', product[key], name.name);
      }else {
        formData.append(key, product[key]);
      }
    });
    formData.append('variations', JSON.stringify(product.variations));

    product.variations.forEach((variation, index) => {
      const name = variation.img as File;

      console.log(index);
      console.log(variation.id);
      console.log(variation.img);
      console.log(variation.img.name);
      formData.append(`variation[${index}][id]`, variation.id);
      formData.append(`variation[${index}][price]`, variation.price);
      formData.append(`variation[${index}][stock]`, variation.stock);
      formData.append(`variation[${index}][img]`, variation.img, name.name);
      formData.append(`variation[${index}][attributes]`, JSON.stringify(variation.attributes));
    });
    console.log(formData);
    return this.http.post(`${environment.apiUrl}api/product`, formData);
  }
  updateProduct(id, product: Product) {
    let params = new HttpParams();
    Object.keys(product).forEach(key => {
      params = params.append(key, product[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/product/${id}`, product, { params } );
  }
  updateProduct2(id,product: Product) {
    let params = new HttpParams();
    //let formData = new FormData();

    Object.keys(product).forEach(key => {
      const name = product[key] as File;
      if(key ==='img') {
        console.log(key);
        console.log(product[key]);
        //params.append('img', product[key], name.name);
      }else {
        params.append(key, product[key]);
      }
    });
    params.append('variations', JSON.stringify(product.variations));
    console.log(product.id);

    product.variations.forEach((variation, index) => {
      const name = variation.img as File;

      console.log(variation.id);
      console.log(variation.img);
      console.log(variation.img.name);
      params.append(`variation[${index}][id]`, variation.id);
      params.append(`variation[${index}][price]`, variation.price);
      params.append(`variation[${index}][stock]`, variation.stock);
      //params.append(`variation[${index}][img]`, variation.img, name.name);
      params.append(`variation[${index}][attributes]`, JSON.stringify(variation.attributes));
    });
    return this.http.put<any>(`${environment.apiUrl}api/product/${id}`, product, { params } );

  }

  uploadImage(id,img) {
    let formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/product_image/${id}`, formData );
  }

  uploadImageVariation(id,img) {
    let formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/product_image_variaiton/${id}`, formData );
  }
  deleteProduct(id) {
    console.log('destroyproduct');
    return this.http.delete<any>(`${environment.apiUrl}api/product/${id}`, { params: id });
  }

  //filters
  getProductByCategoryId(id) {
    console.log('getproductById');
    return this.http.get<any>(`${environment.apiUrl}api/product/category/${id}`, { params: id })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  getProductBySubCategoryId(id) {
    console.log('getproductById');
    return this.http.get<any>(`${environment.apiUrl}api/product/subcategory/${id}`, { params: id })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  getProductBySuperCategoryId(id) {
    console.log('getproductById');
    return this.http.get<any>(`${environment.apiUrl}api/product/supercategory/${id}`, { params: id })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        console.log(respons);
        return respons;
      }));
  }

  getProductByFilters(filters) {
      let params = new HttpParams();
      filters.forEach(filter => {
        Object.keys(filter).forEach(key => {
          if(Array.isArray(filter[key])){
            console.log('is array')
            Object.keys(filter[key]).forEach(key2 => {
                params = params.append(key+'[]', filter[key][key2].id);
              console.log(key , filter[key][key2].id);
            });
          }else{
            params = params.append(key, filter[key]);
          }
        });
      });

      console.log(params);
      return this.http.post<any>(`${environment.apiUrl}api/product/filters`,  filters )
        .pipe(map(data => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log(data);
          return data;
        }));
    }
  getProductByFilters2(filters) {
      let params = new HttpParams();
      filters.forEach(filter => {
        Object.keys(filter).forEach(key => {
          if(Array.isArray(filter[key])){
            console.log('is array')
            Object.keys(filter[key]).forEach(key2 => {
                params = params.append(key+'[]', filter[key][key2].id);
              console.log(key , filter[key][key2].id);
            });
          }else{
            params = params.append(key, filter[key]);
          }
        });
      });

      console.log(params);
      return this.http.post<any>(`${environment.apiUrl}api/product/filters`,  params )
        .pipe(map(data => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          console.log(data);
          return data;
        }));
    }

  sendFilters(filters):any {
    return this.http.post(`${environment.apiUrl}api/product/filters`, filters);
  }
  }
