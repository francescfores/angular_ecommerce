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
import {AddressService} from "../../../services/api/address.service";
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
  autocloseTime=1000;

  //step 2
  formPersonalData: FormGroup;
  submitted = false;

  success=false;
  private countries: any;
  private country: any;
  private provinces: any;
  private province: any;
  private rates: any;
  private carrier: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private orderService: OrderService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private http: HttpClient
  ) {
    this.payPal = paypal;
    this.cart = new Cart();
    this.step=1;
    this.addressService.getContries()
      .pipe(first())
      .subscribe(
        res => {
          this.countries =res.data;
          this.country = this.countries.find(x=>x.id===this.countries[0].id);
          this.provinces= this.country.provinces;
          this.province= this.country.provinces[0];
          this.fpd.country.setValue(this.country.id);
          this.fpd.province.setValue(this.provinces[0].id);
          console.error('this.country');
          console.log(this.country);
          console.log(this.province);
          console.log(this.fpd.country.value);
          console.log(this.fpd.province.value);
        },
        error => {
          console.log(error)
        });
    this.addressService.getRates()
      .pipe(first())
      .subscribe(
        res => {
          console.log(res)

          this.rates =res.Rates;
          console.log(this.rates)

          //this.loading=false;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          console.log('----------res-------')
          console.log(error)
        });
    this.getCartFromLocalStorage();
    this.groupProducts();
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
      country: ['Espa??a', [Validators.required]],
      postal_code: ['43500', [Validators.required]],
      population: ['Tortosa', [Validators.required]],
      province: ['Tarragona', [Validators.required]],
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
  }
  ngAfterViewInit():void{
    if (!this.authenticationService.currentClientValue) {
      this.router.navigate(['/auht/login']);
    }else {
      this.client =this.authenticationService.currentClientValue;
    }
  }
  getCartFromLocalStorage() {

    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
    console.log('getCartFromLocalStorage')
    console.log(this.cart)
  }

  saveCartToLocalStorage() {
    console.log('saveCartToLocalStorage')
    console.log(this.cart)
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeProduct(product) {
    console.log('remove', product)
    const index = this.groupedProducts.findIndex(x => x.id === product.id);

    console.log('remove', product)
    if (index > -1) {
      this.groupedProducts.splice(index, 1);
      this.cart.products.splice(index, 1);
      this.saveCartToLocalStorage();
      this.totalPrice = (this.totalPrice-product.total);
      console.log('product.total', product.total)

      this.totalPrice = Number(parseFloat(String(this.totalPrice)).toFixed(2));

    }
  }

  ngOnInit(): void {

    //this.initConfig();
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
    try {
      const result = await this.http.post(`${environment.apiUrl}api/payment-intent`, data, {headers: headers}).toPromise();
      console.log(result);
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
        console.log(error);
      }else{
        console.log(paymentIntent);
        this.createOrder(paymentIntent);
      }
    } catch(error) {
      this.show=true;
      this.text=error
      this.color='danger'
      this.loading=false;
      console.log(error);
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
  // M??todo para enviar los datos de la compra a ngx-paypal
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
        El evento onClientAuthorization se ejecuta despu??s de
        que el cliente haya autorizado el pago en PayPal, lo que significa que haya proporcionado
        informaci??n de pago y haya confirmado que desea realizar el pago. En este punto, el pago a??n
        no se ha realizado y a??n est?? pendiente de aprobaci??n por parte de PayPal.

        En cambio, el evento onApprove se ejecuta despu??s de que PayPal haya aprobado el pago, lo que significa que se ha
        realizado una transacci??n exitosa y el dinero se ha transferido.
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

      El evento onInit se invoca cuando ngx-paypal est?? listo para recibir los datos de la compra. Este evento es ??til si necesitas realizar alguna acci??n antes de iniciar la compra, como mostrar una animaci??n de carga o desactivar el bot??n de pago hasta que ngx-paypal est?? listo.

      El evento onClick se invoca cuando el usuario hace clic en el bot??n de pago en tu aplicaci??n. Este evento es ??til si necesitas realizar alguna acci??n antes de que se inicie la compra, como validar los datos de la compra o mostrar un mensaje de confirmaci??n.

      En resumen, el evento onInit se invoca cuando ngx-paypal est?? listo para recibir los datos de la compra, mientras que el evento onClick se invoca cuando el usuario hace clic en el bot??n de pago en tu aplicaci??n.
       */
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
      onInit: (data, actions) => {
        // Este m??todo es invocado cuando ngx-paypal est?? listo para recibir los datos de la compra
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
              console.log(res.result.verdict)
              console.log(res.result.verdict?.addressComplete)
              //validar mejor la url ejemplo Administrative area level (provincia)
              if(res.result.verdict?.addressComplete){
                this.show=true;
                this.text='Direccion correcta'
                this.color='success'
                this.step=step;
                this.submitted = false;
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
              // this.loading = false;
            });


      } else {
        console.log('invalid');
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
        console.log('invalid');
        this.show=true;
        this.text='Selecciona una opcion de entrega'
        this.color='danger'
      }
    }
    if(step===5){
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
      product = this.groupedProducts.find(x=> x.id === product.id);
      product.total = Math.round((number*product.price) * 100) / 100
      product.count = Number(number)
      //for (let i = product.count;i!==0;i--){
     //   this.cart.products.push(product)
     // }
      //this.saveCartToLocalStorage();

    }
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
          console.log(res)
          //this.success=true;
          this.loading=false;
          //this.createToken(this.step);

          //this.loading=false;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          console.log(error)
          this.createToken(this.step);
          this.loading=false;
          // this.loading = false;
        });
  }

  goToShop() {
    this.router.navigate(['/shop/products']);
  }

  selectCountry($event: any) {
    this.country = this.countries.find(x=>x.id===Number($event.target.value));
    console.log(this.country);
    if (this.country !== undefined) {
      this.provinces= this.country.provinces;
      console.log(this.provinces);
      //TODO set form address
    }
  }
  selectProvince($event: any) {
    this.province = this.provinces.find(x=>x.id===Number($event.target.value));
    if (this.province !== undefined) {
      //TODO set form address
    }
    console.log(this.province);
  }

  //onShowChange(value: boolean) {
  //  console.log(value);
  //  this.show = value;
  //}
  selectRate(value: any) {
    this.carrier=value;
    console.log(this.carrier);

  }
}
