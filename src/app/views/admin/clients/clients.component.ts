import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {Product} from "../../../models/product";
import {Category} from "../../../models/category";
import {SubCategory} from "../../../models/subcategory";
import {SuperCategory} from "../../../models/supercategory";
import {first} from "rxjs/operators";
import {ClientService} from "../../../services/api/client.service";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent  implements OnInit {
  clients=null;
  constructor(
    private router: Router,
    private clientService: ClientService,
  ) {
  }

  ngOnInit() {
    this.clientService.getClientsPaginated(1)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.clients);

          this.clients= data.clients;
          this.clients.current_page =data.clients.current_page+'';

          console.log(data);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }

  editProduct(id) {

  }

  deleteProduct(id) {

  }

  paginatedProducts(pr) {
    Number(this.clients.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.clients.current_page)
      if(pr === this.clients.last_page){
        pr = Number(this.clients.current_page)
      }else{
        pr++;
      }
    }
    this.clientService.getClientsPaginated(pr)
      .pipe(first())
      .subscribe(
        data => {
          this.clients = data.clients;
          this.clients.current_page = data.clients.current_page+'';
          console.log(pr);
          console.log(this.clients.current_page);
          console.log(this.clients.current_page===pr);
        },
        error => {
        });
  }
}
