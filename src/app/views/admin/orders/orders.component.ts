import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ClientService} from "../../../services/api/client.service";
import {first} from "rxjs/operators";
import {OrderService} from "../../../services/api/order.service";
import {SharedService} from "../../../services/api/shared.service";

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
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.getPaginated(1);
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

  getPaginated(page){
    this.orderService.getPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          this.orders= data.orders;
          this.orders.current_page =data.orders.current_page+'';
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }

  paginated(pr) {
    this.orders.current_page=this.sharedService.paginated(pr, this.orders);
    this.getPaginated(pr)
  }
}
