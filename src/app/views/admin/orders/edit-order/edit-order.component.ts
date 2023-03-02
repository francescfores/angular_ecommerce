import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../../services/api/product.service";
import {ActivatedRoute, Params} from "@angular/router";
import {UntypedFormBuilder} from "@angular/forms";
import {Product} from "../../../../models/product";
import {Category} from "../../../../models/category";
import {SubCategory} from "../../../../models/subcategory";
import {SuperCategory} from "../../../../models/supercategory";
import {first} from "rxjs/operators";
import {OrderService} from "../../../../services/api/order.service";

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit{
  id: number;
  queryObj: any;
  private loaded: boolean;
  private order: any;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
  }
  ngOnInit() {
    this.getParams();
  }
  getParams(){
    this.route.queryParamMap
      .subscribe((params) => {
          this.queryObj = { ...params.keys, ...params };
          this.id =this.queryObj.params.id;
          console.log(this.id)
        this.getOrder()
        }
      );
  }
  getOrder(){
    this.orderService.getOrderById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          this.order = data.data;
          this.loaded=true;
        },
        error => {
        });
  }
}
