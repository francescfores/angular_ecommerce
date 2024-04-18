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

export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories() {
    return this.http.get<any>(`${environment.apiUrl}api/product_category`, {  });
  }
  getCategorysPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/category_paginated?page=`+page, {  });
  }
  getSubCategorysPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/subcategory_paginated?page=`+page, {  })
      .pipe(map(respons => {
        // store product details and jwt token in local storage to keep product logged in between page refreshes
        return respons;
      }));
  }
  getSubCategorysByCategoryPaginated(page,id) {
    return this.http.get<any>(`${environment.apiUrl}api/category/${id}/subcategory_paginated?page=`+page, {  });
  }
  getSuperCategorysPaginated(page) {
    return this.http.get<any>(`${environment.apiUrl}api/supercategory_paginated?page=`+page, {  });
  }
  getSuperCategorysBySubCategoryPaginated(page,id) {
    return this.http.get<any>(`${environment.apiUrl}api/subcategory/${id}/supercategory_paginated?page=`+page, {  });
  }
  getCategoryById(id) {
    console.log('getcategoryById');
    return this.http.get<any>(`${environment.apiUrl}api/product_category/${id}`, { params: id });
  }

  getSubcategoryById(id) {
    console.log('getcategoryById');
    return this.http.get<any>(`${environment.apiUrl}api/product_subcategory/${id}`, { params: id });
  }
  getSupercategoryById(id) {
    console.log('getcategoryById');
    return this.http.get<any>(`${environment.apiUrl}api/product_supercategory/${id}`, { params: id });
  }

  createCategory2(category: Category) {
    console.log('createcategory');
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.post<any>(`${environment.apiUrl}api/category`, params);
  }
  createCategory(category: Category) {
    const params = new FormData();
    Object.keys(category).forEach(key => {
      const name = category[key] as File;

      if(key ==='img') {
        console.log(key);
        console.log(category[key]);

        params.append('img', category[key], name.name);
      }else {
        params.append(key, category[key]);
      }
    });
    return this.http.post<any>(`${environment.apiUrl}api/product_category`,  params );
  }
  createSubcategory(subcategory: SubCategory, id) {
    const params = new FormData();
    Object.keys(subcategory).forEach(key => {
      const name = subcategory[key] as File;

      if(key ==='img') {
        console.log(key);
        console.log(subcategory[key]);
        params.append('img', subcategory[key], name.name);
      }else {
        params.append(key, subcategory[key]);
      }
    });
    params.append('category_id', id);

    return this.http.post<any>(`${environment.apiUrl}api/product_subcategory`,  params );
  }
  createSupercategory(subcategory: SuperCategory, id) {
    const params = new FormData();
    Object.keys(subcategory).forEach(key => {
      const name = subcategory[key] as File;

      if(key ==='img') {
        console.log(key);
        console.log(subcategory[key]);
        params.append('img', subcategory[key], name.name);
      }else {
        params.append(key, subcategory[key]);
      }
    });
    params.append('subcategory_id', id);

    return this.http.post<any>(`${environment.apiUrl}api/product_supercategory`,  params );
  }

  updateCategory(id, category: Category) {
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/product_category/${id}`, category, { params } );
  }

  updateSubcategory(id, category: SubCategory) {
    console.log(id)
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/product_subcategory/${id}`, category, { params } );
  }

  updateSupercategory(id, category: SuperCategory) {
    console.log(id)
    let params = new HttpParams();
    Object.keys(category).forEach(key => {
      params = params.append(key, category[key]);
    });
    return this.http.put<any>(`${environment.apiUrl}api/product_supercategory/${id}`, category, { params } );
  }

  uploadImage(id,img) {
    let formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/product_category_image/${id}`, formData );
  }

  uploadImageSubcat(id,img) {
    let formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/product_subcategory_image/${id}`, formData );
  }

  uploadImageSupercat(id,img) {
    let formData = new FormData();
    const name = img as File;
    formData.append(id,id);
    formData.append('img',img, name.name);
    return this.http.post<any>(`${environment.apiUrl}api/product_supercategory_image/${id}`, formData );
  }

  deleteCategory(id) {
    console.log('destroycategory');
    return this.http.delete<any>(`${environment.apiUrl}api/product_category/${id}`, { params: id });
  }

}
