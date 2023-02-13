import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Cart} from "../../../models/cart";
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {ICreateOrderRequest, IPayPalConfig, NgxPayPalModule} from "ngx-paypal";
import * as _ from 'lodash';

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
  show=true;
  groupedProducts = [];
  private totalPrice=0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,private paypal: NgxPayPalModule) {
    this.payPal = paypal;
    this.cart = new Cart();
    this.step=1;
    this.getCartFromLocalStorage();

  }
  groupProducts() {
    this.groupedProducts = this.cart.products.reduce((acc, curr) => {
      const itemIndex = acc.findIndex(item => item.id === curr.id);
      const color = curr.colors;
      const price = parseFloat(parseFloat((curr.hasOwnProperty('price')
        ? curr.price : curr.inventory.price).replace(',', '.')).toFixed(2));
      if (itemIndex === -1) {
        acc.push({
          id: curr.id,
          img: curr.img,
          price: price,
          name: curr.name,
          count: 1,
          total: price });
      } else {
        acc[itemIndex].count++;
                 // 1.00
        acc[itemIndex].total += price;
        acc[itemIndex].total = Math.round(acc[itemIndex].total * 100) / 100;
      }

      return acc;
    }, []);
    this.groupedProducts.forEach(product => {
      console.log('product.total ', product.total)
      this.totalPrice += product.total;
    });
    console.log(this.totalPrice)
    console.log('this.cart.products')
    console.log(this.groupedProducts);
    this.cart.products = this.groupedProducts;
  }
  ngAfterViewInit():void{
    if (!this.authenticationService.currentClientValue) {
      this.router.navigate(['/auht/login']);
    }
  }
  getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
    console.log(this.cart)
    this.groupProducts();

  }

  ngOnInit(): void {
    this.initConfig();
  }
  pay() {
    this.showPaypalButtons = true;
  }

  back(){
    this.showPaypalButtons = false;
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AQ3-gOeQ3L0ShlgWccK-_JhU8jZUyatJ6fLO5dHjurP3tyVy1QxmzWvKTVAGZZ_FLEvXTerNddXwCzyb',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
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
  // Método para enviar los datos de la compra a ngx-paypal

  goStep(step) {
    this.step=step;
    console.log(step)
  }

  createOrder() {
    this.loading = true;
  }


  updateCount(event, product) {
    let number = event.target.value;
    console.log('number', number)
    console.log('remove', product)
    console.log('remove', product.total)
    console.log('remove', product.price)
    if (event.target.value > 0) {


      this.totalPrice = (this.totalPrice-product.total) + (number*product.price);
      this.totalPrice = Math.round(this.totalPrice * 100) / 100;
      this.groupedProducts.find(x=> x.id === product.id).total = Math.round((number*product.price) * 100) / 100

      let key = event.target.value;

      if (key === 'ArrowUp') {
        console.log('ArrowUp')

      } else if (key === 'ArrowDown') {
        console.log('ArrowDown')

      }
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
}
