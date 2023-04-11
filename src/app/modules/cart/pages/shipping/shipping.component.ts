import {Component, OnInit} from '@angular/core';
import {CarrierService} from "../../../../services/api/carrier.service";
import {CartService} from "../../services/shared/cart.service";
import {Cart} from "../../../../models/cart";

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit{
  carrier: any;
  carriers: any;
  loading=false;
  cart: Cart;

  constructor(
    private carrierService: CarrierService,
    private cartService: CartService,
  ) {
  }

  ngOnInit() {
    this.loading=true;
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('this.cart',this.cart)

    });
    this.cartService.setShippingValid(false);
    this.getCarriers();
  }

  getCarriers(){
    this.carrierService.getCarriers().subscribe({
      next: res => {
        this.carriers =res.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
      },
      complete: () => { }
    });
  }

  selectRate(value: any) {
    this.carrier=value;
    //this.sub_total= Number(this.carrier.rate)+ this.totalPrice
  }

  goToNextStep() {
    if (this.carrier) {
      this.carrier.rate = Number(this.carrier.rate)
      this.cart.sub_total= this.carrier.rate + this.cart.total;
      this.cart.shipping.carrier= this.carrier;
      this.cartService.updateCart(this.cart);
      this.cartService.setShippingValid(true);
      this.cartService.goStep(4);
    }
  }
}
