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
import {SharedService} from "../../../services/api/shared.service";

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
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.getPaginated(1)
  }

  editProduct(id) {

  }

  deleteProduct(id) {

  }


  getPaginated(page){
    this.clientService.getClientsPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          this.clients = data.clients;
          this.clients.current_page = data.clients.current_page+'';

          console.log(this.clients)
        },
        error => {
        });
  }
  paginated(pr) {
    this.clients.current_page=this.sharedService.paginated(pr, this.clients);
    this.getPaginated(pr);
  }
}
