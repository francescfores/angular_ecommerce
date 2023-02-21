import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsPageComponent } from './products/products-page.component';
import {ShopRoutingModule} from './shop-routing.module';
import {ProductListComponent} from '../../components/ecommerce/products/product-list/product-list.component';
import {ComponentsModule} from '../../components/components.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import {ProductService} from '../../services/api/product.service';
import {NgxPayPalModule} from "ngx-paypal";
import {ProfileComponent} from './profile/profile.component';
import { ProfileClientComponent } from './profile-client/profile-client.component';
import {NgxStripeModule, StripeCardComponent} from "ngx-stripe";
import {ReactiveFormsModule} from "@angular/forms";

import { PaymentComponent } from './payment/payment.component';


@NgModule({
  declarations: [ProductsPageComponent, ProductListComponent, ProductDetailComponent, CartComponent, ProfileClientComponent, PaymentComponent, PaymentComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    ComponentsModule,
    NgxPayPalModule,
    StripeCardComponent,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(
      'pk_test_51MdcD9G72AP1pY3usq8Eun6PO8buzaLm1nHdbu7KjxOQ6ms4Qxy3faW7BN8rhX8oBVFgS9dv3Lq12wLZHjGvXTLN00twOfb7EK'
    ),
  ],
  exports: [ProductsPageComponent],
  providers: [ProductService
  ]
})
export class ShopModule { }
