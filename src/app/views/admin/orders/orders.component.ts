import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ClientService} from "../../../services/api/client.service";
import {first} from "rxjs/operators";
import {OrderService} from "../../../services/api/order.service";
import {SharedService} from "../../../services/api/shared.service";
import {ToastrService} from 'ngx-toastr';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  imgUrl=environment.apiUrl;
  orders=null;
  private returns: any;
  private return_pg: any;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private sharedService: SharedService,
    private toastr: ToastrService
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
    this.orderService.deleteOrder(id)
      .subscribe({
        next: res => {
          this.toastr.info(res.message);
          this.getPaginated(this.orders.current_page)
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  getPaginated(page){
    this.orderService.getPaginated(page)
      .subscribe({
        next: data => {
          this.orders= data.orders;
          this.orders.current_page =data.orders.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });

    this.orderService.getReturnPaginated(page)
      .pipe(first())
      .subscribe(
        res => {
          this.returns= res.return_pg;
          this.returns.current_page =res.return_pg.current_page+'';
        },
        error => {
        });
  }

  paginated(pr) {
    this.orders.current_page=this.sharedService.paginated(pr, this.orders);
    this.getPaginated(pr)
  }
}
