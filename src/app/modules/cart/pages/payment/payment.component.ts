import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CartService} from "../../services/shared/cart.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../services/api/authentication.service";
import {NgxPayPalModule} from "ngx-paypal";
import {OrderService} from "../../../../services/api/order.service";
import {AddressService} from "../../../../services/api/address.service";
import {CarrierService} from "../../../../services/api/carrier.service";
import {StripeCardComponent, StripeService} from "ngx-stripe";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {ToastrService} from "ngx-toastr";
import {Cart} from "../../../../models/cart";
import {Payment} from "../../../../models/payment";
import {environment} from "../../../../../environments/environment";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit{
  imgUrl=environment.apiUrl;

  @ViewChild(StripeCardComponent, { static: false}) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#222222',
        color: '#222222',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#222222',
        },
      },
      invalid: {
        color: '#f44336',
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  stripeTest: FormGroup;
  token: any;

  submitted = false;
  loading=true;
  step: number;
  success=false;

  cart: Cart;
  groupedProducts = [];
  private client: any;

  constructor(
    //Refactor
    private cartService: CartService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private fb: FormBuilder,
    public stripeService: StripeService,
    private http: HttpClient,
    private toastr: ToastrService,
    private orderService: OrderService,
  ) {

  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log(this.cart)
    });

    this.cartService.setPaymentValid(false);
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.loading=false;
    this.groupProducts();
    this.cartService.currentStep.subscribe((step) => {
      this.step = step;
    });
  }

  ngAfterViewInit():void{
    if (this.authenticationService.currentClientValue) {
      this.client =this.authenticationService.currentClientValue;
    }
  }

  get fc() {
    return this.stripeTest.controls;
  }

  goToNextStep(){
    this.loading=false;
    this.submitted = false;
    this.cartService.setPaymentValid(true);
    this.cartService.goStep(5);
  }

  createToken(): void {
    this.cartService.stripeCardElement = this.card;
    this.loading=true;
    this.submitted = true;
    const name = this.stripeTest.get('name').value;
    if(this.stripeTest.valid){
      this.stripeService
        .createToken(this.card.element, { name })
        .subscribe((result) => {
          this.loading=false;
          if (result.token) {
            this.token=result.token;
            this.cart.payment=new Payment();
            this.cart.payment.token=this.token;
            this.cartService.updateCart(this.cart);
            this.goToNextStep();
          } else if (result.error) {
            this.toastr.error(result.error.message);
          }
        });
    }else{
      this.loading=false;
      this.toastr.error('Formulario invalido');
    }
  }

  async paymentIntent(){
    this.loading=true;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = {amount: this.cart.total, currency: 'EUR', token: this.cart.payment.token.id};
    try {
      const result = await this.http.post(`${environment.apiUrl}api/payment-intent`, data, {headers: headers}).toPromise();
      const { paymentIntent, error } = await this.stripeService.confirmCardPayment(result.toString(), {
        payment_method: {
          card: this.card.element,
          billing_details: {
            name: this.fc.name.value
          }
        }
      }).toPromise();
      if (error) {
        this.toastr.error('error');
        this.loading=false;
      }else{
        this.createOrder(paymentIntent);
      }
    } catch(error) {
      this.toastr.error(error);
      this.loading=false;
    }
  }
  createOrder(payment){
    this.cart.payment=payment;
    this.cart.products=this.groupedProducts;
    this.orderService.createOrder(this.cart,this.client.id)
      .pipe(first())
      .subscribe(
        res => {
          this.loading=false;
          this.success=true;
        },
        error => {
          this.loading=false;
          this.toastr.error('error');
        });
  }

  groupProducts() {
    this.groupedProducts =this.cartService.groupProducts();
    this.loading=false;
  }

  goToShop() {
    this.router.navigate(['/shop/products']);
  }
}
