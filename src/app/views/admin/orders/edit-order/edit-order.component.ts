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
  order: any;
  updateOrder=false;
  statuses = [
    { id: 1, key:'pending', name: 'Pendiente' },
    { id: 2, key:'processing', name: 'Procesando' },
    { id: 3, key:'shipped', name: 'Enviado' },
    { id: 4, key:'delivered', name: 'Entregado' },
    { id: 5, key:'returned', name: 'Devuelto' },
    { id: 6, key:'cancelled', name: 'Cancelado' },
  ];
  status:string;
  private sub_total=0;

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
          this.status=this.order.status;
          this.order.total = Number(this.order.total);
          this.sub_total = Number(this.order.total)+Number(this.order.sending.carrier.rate)
          console.log(this.status)

          this.loaded=true;
        },
        error => {
        });
  }

  updateStatus($event: any) {
    this.orderService.updateStatus(this.id,$event.target.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          this.order = data.data;
          this.order.total = Number(this.order.total);
          this.sub_total = Number(this.order.total)+Number(this.order.sending.carrier.rate)
          this.status=this.order.status;
          this.loaded=true;
        },
        error => {
        });
  }

  editSending() {
    console.log('eee')
  }

  update() {
  }
}
