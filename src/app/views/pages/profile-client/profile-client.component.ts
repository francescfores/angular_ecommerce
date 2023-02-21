import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {NgxPayPalModule} from "ngx-paypal";
import {OrderService} from "../../../services/api/order.service";
import {Cart} from "../../../models/cart";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {
  openTab = 1;
  private client: any;
  orders: any;
  showOrder: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this.client =this.authenticationService.currentClientValue;
    this.getOrders();
  }
  toggleTabs($tabNumber: number){
    this.openTab = $tabNumber;
  }
  getOrders(){
    this.orderService.getOrderByClient(this.client.id)
      .pipe(first())
      .subscribe(
        res => {
          console.log(res)
          this.orders= res.data;
          this.orders.details= res.data.details;
          console.log(this.orders[0].details);

//          this.router.navigate(['/shop/products']);
        },
        error => {
          // this.loading = false;
        });
  }

  showOrderSelected(order) {
    this.showOrder=order.id;
    console.log(order.details[0].variation)
  }
}
