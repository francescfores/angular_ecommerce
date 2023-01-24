import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { IndexComponent } from './index/index.component';
import {EcommerceNavbarComponent} from "../../components/navbars/ecommerce-navbar/ecommerce-navbar.component";
import {DefaultNavbarComponent} from "../../components/navbars/default-navbar/default-navbar.component";
import {AppModule} from "../../app.module";
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    ComponentsModule
  ],
  exports: [IndexComponent]
})
export class ShopModule { }
