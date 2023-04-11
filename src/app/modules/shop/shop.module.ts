import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsPageComponent } from './pages/products/products-page.component';
import {ShopRoutingModule} from './shop-routing.module';
import {ProductListComponent} from '../../components/ecommerce/products/product-list/product-list.component';
import {ComponentsModule} from '../../components/components.module';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import {CartComponent} from './pages/cart/cart.component';
import {ProductService} from '../../services/api/product.service';
import {NgxPayPalModule} from 'ngx-paypal';
import { ProfileClientComponent } from './pages/profile-client/profile-client.component';
import {NgxStripeModule, StripeCardComponent} from 'ngx-stripe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { PaymentComponent } from './pages/payment/payment.component';
import { AddressComponent } from './pages/cart/address/address.component';
import {IndexComponent} from './index/index.component';


@NgModule({
  declarations: [
    IndexComponent,
    ProductsPageComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProfileClientComponent,
    CartComponent,
    AddressComponent,
  ],
    imports: [
        CommonModule,
        ShopRoutingModule,
        ComponentsModule,
        NgxPayPalModule,
        StripeCardComponent,
        ReactiveFormsModule,
        NgxStripeModule.forRoot('pk_test_51MdcD9G72AP1pY3usq8Eun6PO8buzaLm1nHdbu7KjxOQ6ms4Qxy3faW7BN8rhX8oBVFgS9dv3Lq12wLZHjGvXTLN00twOfb7EK'),
        FormsModule,
    ],
  exports: [IndexComponent],
  providers: [ProductService
  ]
})
export class ShopModule { }
