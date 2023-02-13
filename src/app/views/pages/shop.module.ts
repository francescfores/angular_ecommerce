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

@NgModule({
  declarations: [ProductsPageComponent,ProductListComponent, ProductDetailComponent, CartComponent],
    imports: [
        CommonModule,
        ShopRoutingModule,
        ComponentsModule,
        NgxPayPalModule
    ],
  exports: [ProductsPageComponent],
  providers: [ProductService]
})
export class ShopModule { }
