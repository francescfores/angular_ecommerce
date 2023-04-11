import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Cart} from "../../../../models/cart";
import {CartService} from "../../services/shared/cart.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../services/api/authentication.service";
import {NgxPayPalModule} from "ngx-paypal";
import {OrderService} from "../../../../services/api/order.service";
import {AddressService} from "../../../../services/api/address.service";
import {CarrierService} from "../../../../services/api/carrier.service";
import {FormBuilder, Validators} from "@angular/forms";
import {StripeService} from "ngx-stripe";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {PaymentComponent} from "../payment/payment.component";
import {first} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit{
  loading=false;
  groupedProducts = [];
  cart: Cart;

  @ViewChild(PaymentComponent, { static: true }) payment: PaymentComponent;
  success=false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private orderService: OrderService,
    private addressService: AddressService,
    private carrierService: CarrierService,
    private fb: FormBuilder,
    public stripeService: StripeService,
    private http: HttpClient,
    private ngZone: NgZone,
    private toastr: ToastrService,
  ) {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('this.cart',this.cart)
    });
  }

  ngOnInit(): void {
    this.loading=true;
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('this.cart',this.cart)
    });
    this.groupProducts();
  }

  groupProducts() {
    this.groupedProducts =this.cartService.groupProducts();
    this.loading=false;
  }

  async paymentIntent(){
    console.log(this.cartService.stripeCardElement)
    this.loading=true;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = {amount: this.cart.total, currency: 'EUR', token: this.cart.payment.token.id};
    try {
      const result = await this.http.post(`${environment.apiUrl}api/payment-intent`, data, {headers: headers}).toPromise();
      const { paymentIntent, error } = await this.stripeService.confirmCardPayment(result.toString(), {
        payment_method: {
          card: this.cartService.stripeCardElement.element,
          billing_details: {
            name: 'name'
          }
        }
      }).toPromise();
      // Capturar errores z
      // Capturar errores
      if (error) {
        // Manejo de errores
        this.toastr.error('error');
        this.loading=false;
        console.log(error);
      }else{
        console.log('guay');
        this.createOrder(paymentIntent);
      }
    } catch(error) {
      console.log(error);
      this.toastr.error('error');

      this.loading=false;
    }
  }
  createOrder(payment){
    console.log(this.cartService.cartSubject.getValue())
    this.cart.products=this.groupedProducts;
    this.cart.payment=payment;
    /*
    this.cart.total=this.totalPrice;
    this.cart.products=this.groupedProducts;
    this.cart.payment=payment;
    this.cart.shipping= {
      carrier:this.carrier,
      name:this.fpd.name.value,
      surnames:this.fpd.surnames.value,
      dni:this.fpd.dni.value,
      phone:this.fpd.phone.value,
      address:this.fpd.address.value,
      address_detail:this.fpd.address_detail.value,
      notes:this.fpd.notes.value,
      country:this.country,
      zip:this.fpd.postal_code.value,
      city:this.fpd.population.value,
      province:this.province
    };
    */
    this.orderService.createOrder(this.cart,1)
      .pipe(first())
      .subscribe(
        res => {
          this.success=true;
          this.loading=false;
          //this.createToken(this.step);
          this.toastr.info('perfect');

          //this.loading=false;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          this.loading=false;
          this.toastr.error('error');

          //this.createToken(this.step);
        });
  }

}
