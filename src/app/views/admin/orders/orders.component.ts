import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ClientService} from "../../../services/api/client.service";
import {first} from "rxjs/operators";
import {OrderService} from "../../../services/api/order.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  orders=null;
  constructor(
    private router: Router,
    private orderService: OrderService,
  ) {
  }

  ngOnInit() {
    this.getOrdersPaginated(1);
  }

  getOrdersPaginated(page){
    this.orderService.getOrdersPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.orders);

          this.orders= data.orders;
          this.orders.current_page =data.orders.current_page+'';

          console.log(data);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }
  editOrder(id) {
    console.log(id)
    this.router.navigate(
      ['/admin/edit-order'],
      { queryParams: { id } }
    );
  }
  deleteOrder(id) {
    /*
    this.orderService.deleteProduct(id)
      .pipe(first())
      .subscribe(
        res => {

          this.text='Producto creado'
          this.color='success'
          this.submitted = false;
          console.log(res);
        },
        error => {
          // this.loading = false;
        });
    */
  }

  paginatedProducts(pr) {
    Number(this.orders.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.orders.current_page)
      if(pr === this.orders.last_page){
        pr = Number(this.orders.current_page)
      }else{
        pr++;
      }
    }
    this.getOrdersPaginated(pr);
  }

}
