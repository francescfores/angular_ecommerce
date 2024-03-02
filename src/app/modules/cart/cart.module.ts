import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CartRoutingModule} from './cart-routing.module';
import {ComponentsModule} from '../../components/components.module';
import {NgxPayPalModule} from 'ngx-paypal';
import {NgxStripeModule, StripeCardComponent} from 'ngx-stripe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IndexComponent} from './index/index.component';
import { CartComponent } from './pages/cart/cart.component';
import { AddressComponent } from "./pages/address/address.component";
import {CartService} from "./services/shared/cart.service";
import { ShoppingBasketComponent } from './pages/shopping-basket/shopping-basket.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SummaryComponent } from './pages/summary/summary.component';


@NgModule({
  declarations: [IndexComponent,CartComponent, AddressComponent, ShoppingBasketComponent, ShippingComponent, PaymentComponent, SummaryComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        ComponentsModule,
        NgxPayPalModule,
        StripeCardComponent,
        ReactiveFormsModule,
        NgxStripeModule.forRoot(
            'pk_test_51MdcD9G72AP1pY3usq8Eun6PO8buzaLm1nHdbu7KjxOQ6ms4Qxy3faW7BN8rhX8oBVFgS9dv3Lq12wLZHjGvXTLN00twOfb7EK'
        ),
        FormsModule,
    ],
    exports: [IndexComponent, ShoppingBasketComponent],
  providers: [CartService
  ]
})
export class CartModule { }
