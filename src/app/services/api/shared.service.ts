import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {first, map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import { Client } from '../../models/client';
import {Sending} from "../../models/sending";

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  constructor(private http: HttpClient) {
  }
  paginated( pr, entity) {
    Number(entity.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(entity.current_page)
      if(pr === entity.last_page){
        pr = Number(entity.current_page)
      }else{
        pr++;
      }
    }
    return pr;
  }

}
