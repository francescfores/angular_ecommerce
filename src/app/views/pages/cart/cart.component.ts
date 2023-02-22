import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Cart} from "../../../models/cart";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule} from "ngx-paypal";
import {first} from "rxjs/operators";
import {OrderService} from "../../../services/api/order.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StripeCardComponent, StripeService} from "ngx-stripe";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewInit {
  public payPalConfig ? : IPayPalConfig;
  public showPaypalButtons: boolean;
  private payPal: NgxPayPalModule;

  loading=false;
  private cart: Cart;
  step: number;
  groupedProducts = [];
  private totalPrice=0;
  private client: any;

  //stripe
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
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
    locale: 'es',
  };
  stripeTest: FormGroup;
  private token: any;
  //end stripe

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=20000;

  //step 2
  formPersonalData: FormGroup;
  submitted = false;

  success=false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private orderService: OrderService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private http: HttpClient
  ) {
    this.payPal = paypal;
    this.cart = new Cart();
    this.step=1;
    this.getCartFromLocalStorage();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.formPersonalData = this.fb.group({
      name: ['', [Validators.required]],
      surnames: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_detail: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      population: ['', [Validators.required]],
      province: ['', [Validators.required]],
    });

  }
  get fc() {
    return this.stripeTest.controls;
  }
  get fpd() {
    return this.formPersonalData.controls;
  }
  groupProducts() {
    this.groupedProducts = this.cart.products.reduce((acc, curr) => {
      const itemIndex = acc.findIndex(item => item.id === curr.id);
      const price = parseFloat(parseFloat(curr.price.replace(',', '.')).toFixed(2));
      if (itemIndex === -1) {
        acc.push({
          product: curr.product,
          id: curr.id,
          img: curr.img,
          count: 1,
          price: price,
          total: price });
      } else {
        acc[itemIndex].count++;
        acc[itemIndex].total += price;
        acc[itemIndex].total = Math.round(acc[itemIndex].total * 100) / 100;
      }

      return acc;
    }, []);
    this.groupedProducts.forEach(product => {
      console.log('product.total ', product.total)
      this.totalPrice = parseFloat(parseFloat(product.total+this.totalPrice).toFixed(2));
    });
    this.cart.products = this.groupedProducts;
    console.log('this.cart.products')
    console.log(this.cart.products)
  }
  ngAfterViewInit():void{
    /*
    if (!this.authenticationService.currentClientValue) {
      this.router.navigate(['/auht/login']);
    }else {
      this.client =this.authenticationService.currentClientValue;
    }
    */
  }
  getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
    console.log('this.cart')
    console.log(this.cart)
    this.groupProducts();

  }
  ngOnInit(): void {
    this.initConfig();
  }
  //stripe generar un token para la intencion de pago

  createToken(step): void {

    const name = this.stripeTest.get('name').value;
    if(this.stripeTest.valid){
      this.stripeService
        .createToken(this.card.element, { name })
        .subscribe((result) => {
          if (result.token) {
            this.token=result.token;
            // Use the token
            console.log(result.token.id);
            this.submitted = false;
            this.step=step;
            //this.paymentIntent();
          } else if (result.error) {
            // Error creating the token
            console.log(result.error.message);
            this.show=true;
            this.text=result.error.message
            this.color='danger'
          }
        });
    }else{
      this.show=true;
      this.text='Formulario invalido'
      this.color='danger'
    }
  }
  async paymentIntent(){
    this.loading=true;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const data = {amount: this.totalPrice*100, currency: 'EUR', token: this.token.id};
    const response = await this.http.post(`${environment.apiUrl}api/payment-intent`, data, {headers: headers}).toPromise();
    console.log('response');
    console.log(response);
    const { paymentIntent, error } = await this.stripeService.confirmCardPayment(response.toString(), {
      payment_method: {
        card: this.card.element,
        billing_details: {
          name: this.fc.name.value
        }
      }
    }).toPromise();
    // Capturar errores
    // Capturar errores
    if (error) {
      // Manejo de errores
      console.log(error);
      this.loading=false;
    }else{
      console.log(paymentIntent);
      this.createOrder();
    }
  }
  //stripe end

  //paypal
  pay() {
    this.showPaypalButtons = true;
  }
  back(){
    this.showPaypalButtons = false;
  }
  // Método para enviar los datos de la compra a ngx-paypal
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AQ3-gOeQ3L0ShlgWccK-_JhU8jZUyatJ6fLO5dHjurP3tyVy1QxmzWvKTVAGZZ_FLEvXTerNddXwCzyb',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '15',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '15'
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '5',
            },
          },
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '5',
              },
            },
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '5',
              },
            }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      /*
        El evento onClientAuthorization se ejecuta después de
        que el cliente haya autorizado el pago en PayPal, lo que significa que haya proporcionado
        información de pago y haya confirmado que desea realizar el pago. En este punto, el pago aún
        no se ha realizado y aún está pendiente de aprobación por parte de PayPal.

        En cambio, el evento onApprove se ejecuta después de que PayPal haya aprobado el pago, lo que significa que se ha
        realizado una transacción exitosa y el dinero se ha transferido.
       */
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);

        actions.order.capture().then(details => {
          console.log('Transaction completed by ' + details.payer.name.given_name);
          console.log('Shipping address: ' + JSON.stringify(details.shipping_address));
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        //this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      /*
          No, el evento onInit y el evento onClick son dos eventos diferentes en ngx-paypal.

      El evento onInit se invoca cuando ngx-paypal está listo para recibir los datos de la compra. Este evento es útil si necesitas realizar alguna acción antes de iniciar la compra, como mostrar una animación de carga o desactivar el botón de pago hasta que ngx-paypal esté listo.

      El evento onClick se invoca cuando el usuario hace clic en el botón de pago en tu aplicación. Este evento es útil si necesitas realizar alguna acción antes de que se inicie la compra, como validar los datos de la compra o mostrar un mensaje de confirmación.

      En resumen, el evento onInit se invoca cuando ngx-paypal está listo para recibir los datos de la compra, mientras que el evento onClick se invoca cuando el usuario hace clic en el botón de pago en tu aplicación.
       */
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
      onInit: (data, actions) => {
        // Este método es invocado cuando ngx-paypal está listo para recibir los datos de la compra
        console.log('ngx-paypal is initialized');
      },
    };
  }
  //paypal end

  goStep(step) {
    if(step===1){
      this.step=step;
    }
    if(step===2){
      this.step=step;
    }
    if(step===3){
      this.submitted = true;
      if (this.formPersonalData.valid){
        this.step=step;
        this.submitted = false;
      } else {
        console.log('invalid');
        this.show=true;
        this.text='Formulario invalido'
        this.color='danger'
      }
    }

    if(step===4){
      this.submitted = true;
      this.createToken(step);
    }

    console.log(step)
  }
  updateCount(event, product) {
    let number = event.target.value;
    console.log('product');
    console.log(product);
    console.log(this.groupedProducts.find(x=> x.id === product.id));
    if (event.target.value > 0) {
      this.totalPrice = (this.totalPrice-product.total) + (number*product.price);
      this.totalPrice = Math.round(this.totalPrice * 100) / 100;
      product = this.cart.products.find(x=> x.id === product.id);
      product.total = Math.round((number*product.price) * 100) / 100
      product.count = Number(number)
      //  let key = event.target.value;
      // if (key === 'ArrowUp') {
      // } else if (key === 'ArrowDown') {
      // }
    }
  }
  removeProduct(product) {
    console.log('remove', product)
    const index = this.groupedProducts.findIndex(x => x.id === product.id);

    console.log('remove', product)
    if (index > -1) {
      this.groupedProducts.splice(index, 1);
    }
    this.totalPrice = (this.totalPrice-product.total);
  }
  createOrder(){

    this.cart.total=this.totalPrice;
    this.orderService.createOrder(this.cart,this.client.id)
      .pipe(first())
      .subscribe(
        res => {
          console.log(res)
          this.success=true;
          //this.loading=false;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          this.loading=false;
          // this.loading = false;
        });
  }

  goToShop() {
    this.router.navigate(['/shop/products']);
  }
}
