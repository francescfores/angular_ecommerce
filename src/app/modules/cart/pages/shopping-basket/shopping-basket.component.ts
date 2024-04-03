import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Cart} from "../../../../models/cart";
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule} from "ngx-paypal";
import {StripeCardComponent, StripeService} from "ngx-stripe";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../services/api/authentication.service";
import {OrderService} from "../../../../services/api/order.service";
import {AddressService} from "../../../../services/api/address.service";
import {CarrierService} from "../../../../services/api/carrier.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {first} from "rxjs/operators";
import {CartService} from "../../services/shared/cart.service";

@Component({
  selector: 'app-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  styleUrls: ['./shopping-basket.component.css']
})
export class ShoppingBasketComponent implements OnInit, AfterViewInit {
  imgUrl=environment.apiUrl;

  // Refactor
  //newCart$ = this.cartService.cart$;
  public newCart:Cart;
  //
  public payPalConfig ? : IPayPalConfig;
  public showPaypalButtons: boolean;
  private payPal: NgxPayPalModule;

  loading=false;
  cart: Cart;
  step: number;
  groupedProducts = [];
  totalPrice=0;
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
  token: any;
  //end stripe

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;

  //step 2
  formPersonalData: FormGroup;
  submitted = false;

  success=false;
  countries: any;
  country: any;
  provinces: any;
  province: any;
  private rates: any;
  carrier: any;
  carriers: any;
  sub_total: number;

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
    private ngZone: NgZone
  ) {
    this.payPal = paypal;
    //this.cart = new Cart();
    this.step=1;
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('this.cart',this.cart)

    });
  }

  get fc() {
    return this.stripeTest.controls;
  }
  get fpd() {
    return this.formPersonalData.controls;
  }

  ngOnInit(): void {
    this.groupProducts();
    //this.getCartFromLocalStorage();

    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.formPersonalData = this.fb.group({
      name: ['f', [Validators.required]],
      surnames: ['f', [Validators.required]],
      dni: ['34', [Validators.required]],
      phone: ['64', [Validators.required]],
      address: ['Carre illa de genova n8', [Validators.required]],
      address_detail: ['3b', [Validators.required]],
      notes: ['No tengo timbre', [Validators.required]],
      country: ['España', [Validators.required]],
      postal_code: ['43500', [Validators.required]],
      population: ['Tortosa', [Validators.required]],
      province: ['Tarragona', [Validators.required]],
    });

    //this.initConfig();
  }

  ngAfterViewInit():void{
    if (this.authenticationService.currentClientValue) {
      this.client =this.authenticationService.currentClientValue;
    }else {
      //this.router.navigate(['/auht/login']);
    }

  }

  getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
      this.groupProducts();
    }else {
      this.loading=false;
    }
  }
  groupProducts() {
    this.groupedProducts =this.cartService.groupProducts();
    console.log(this.groupedProducts)
    // if(this.groupedProducts.length>0){
    //   //this.cartService.setBasketValid(true);
    // }
    /*
    this.groupedProducts = this.cart.products.reduce((acc, curr) => {
      const itemIndex = acc.findIndex(item => item.id === curr.id);
      const price = Number(curr.price);
      if (itemIndex === -1) {
        acc.push({
          product: curr.product,
          id: curr.id,
          img: curr.img,
          count: 1,
          price: price,
          total: price
        });
      } else {

        acc[itemIndex].count++;
        //acc[itemIndex].total += Number(price)+Number(acc[itemIndex].total);
        acc[itemIndex].total += +price;

        //acc[itemIndex].total = Math.round(acc[itemIndex].total * 100) / 100;
      }
      return acc;
    }, []);
    */
    //this.updateCartTotal();

  }
  updateCartTotal(){
    this.groupedProducts.forEach(product => {
      this.totalPrice = Number(product.total)+Number(this.totalPrice);
    });
    this.loading=false;
  }
  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeProduct(product) {
    this.cartService.removeProduct(product);
    this.groupProducts();

    /*
        const index = this.groupedProducts.findIndex(x => x.id === product.id);
        if (index > -1) {
          this.groupedProducts.splice(index, 1);
          this.cart.products.splice(index, 1);
          this.saveCartToLocalStorage();
          this.totalPrice = (this.totalPrice-product.total);
          this.totalPrice = Number(parseFloat(String(this.totalPrice)).toFixed(2));
        }
        */
    this.loading=false;
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
            console.log(this.token);
            // Use the token
            this.submitted = false;
            this.step=step;
            //this.paymentIntent();
          } else if (result.error) {
            // Error creating the token
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
    const data = {amount: this.totalPrice, currency: 'EUR', token: this.token.id};
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
      // Capturar errores z
      // Capturar errores
      if (error) {
        // Manejo de errores
        this.show=true;
        this.text=error
        this.color='danger'
        this.loading=false;
      }else{
        this.createOrder(paymentIntent);
      }
    } catch(error) {
      this.show=true;
      this.text=error
      this.color='danger'
      this.loading=false;
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
  goStep(step) {
    if(step===1){
      this.step=step;
    }
    if(step===2){
      this.step=2;

      /*this.addressService.getContries().subscribe({
        next: res => {
          console.log('¡sdddddddddddddddddddddddddddddd')
          console.log(res)
          console.log(res.data)
          this.countries =res.data;
          this.country = this.countries.find(x=>x.id===this.countries[0].id);
          this.provinces= this.country.provinces;
          this.province= this.country.provinces[0];
          this.fpd.country.setValue(this.country.id);
          this.fpd.province.setValue(this.provinces[0].id);
          this.step=step;
          this.loading=false;
        },
        error: (err: any) => {
          this.loading = false;
        },
        complete: () => { }
      });*/
    }
    if(step===3){
      this.submitted = true;
      this.step=-1;
      this.loading=true;
      this.getCarriers();

      //shippypro
      /*
      this.addressService.getRates().subscribe({
        next: res => {
          this.rates =res.Rates;
        },
        error: (err: any) => {
          this.loading = false;
        },
        complete: () => { }
      });
      */

      if (this.formPersonalData.valid){
        this.addressService.validAddress({
          address:this.fpd.address.value,
          country:this.country.code,
          province:this.province.name,
          population:this.fpd.population.value,
          postal_code:this.fpd.postal_code.value,
        })
          .pipe(first())
          .subscribe(
            res => {
              //validar mejor la url ejemplo Administrative area level (provincia)
              if(res.result.verdict?.addressComplete){
                this.show=true;
                this.text='Direccion correcta'
                this.color='success'
                this.step=step;
                this.submitted = false;
                this.getCarriers();
              }else{
                this.show=true;
                this.text='Direccion invalida'
                this.color='danger'
                this.submitted = false;
              }
              //this.loading=false;
//          this.router.navigate(['/shop/products']);
            },
            error => {
              this.loading=false;
              this.text='error'
            });
      } else {
        this.show=true;
        this.text='Formulario invalido'
        this.color='danger'
      }
    }
    if(step===4){
      if (this.carrier){
        //this.createOrder(step);
        this.step=step;
      } else {
        this.show=true;
        this.text='Selecciona una opcion de entrega'
        this.color='danger'
      }
    }
    if(step===5){
      this.submitted = true;
      this.createToken(step);
    }
    //this.text='Step undefined'

  }
  selectQuantityProduct(event, product) {
    let num = event.target.value;
    this.cartService.selectQuantityProduct(num,product)
    //this.groupProducts();
    /*
    if (event.target.value > 0) {
      this.totalPrice = (this.totalPrice-product.total) + (number*product.price);
      this.totalPrice = Math.round(this.totalPrice * 100) / 100;
      product = this.groupedProducts.find(x=> x.id === product.id);
      product.total = Math.round((number*product.price) * 100) / 100
      product.count = Number(number)
      //for (let i = product.count;i!==0;i--){
     //   this.cart.products.push(product)
     // }
      //this.saveCartToLocalStorage();
    }*/
  }
  createOrder(payment){

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
    this.orderService.createOrder(this.cart,this.client.id)
      .pipe(first())
      .subscribe(
        res => {
          this.success=true;
          this.loading=false;
          //this.createToken(this.step);

          //this.loading=false;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          this.createToken(this.step);
          this.loading=false;
          this.show=true;
          this.text=error
          this.color='danger'
        });
  }

  goToShop() {
    this.router.navigate(['/shop/products']);
  }

  selectCountry($event: any) {
    this.country = this.countries.find(x=>x.id===Number($event.target.value));
    if (this.country !== undefined) {
      this.provinces= this.country.provinces;
      //TODO set form address
    }
  }
  selectProvince($event: any) {
    this.province = this.provinces.find(x=>x.id===Number($event.target.value));
    if (this.province !== undefined) {
      //TODO set form address
    }
  }
  selectRate(value: any) {
    this.carrier=value;
    this.sub_total= Number(this.carrier.rate)+ this.totalPrice
  }

  goToNextStep(){
    this.submitted = true;
    this.cartService.setBasketValid(true);
    this.cartService.goStep(2);
  }

}
