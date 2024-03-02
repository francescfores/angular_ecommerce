import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FooterComponent} from './footers/footer/footer.component';
import {EcommerceNavbarComponent} from './navbars/ecommerce-navbar/ecommerce-navbar.component';
import {RouterModule} from "@angular/router";
import { CategoryFiltersComponent } from './category-filters/category-filters.component';
import { SliderComponent } from './slider/slider.component';
import { AlertComponent } from './alert/alert.component';
import { GooglePlacesComponent } from './google-places/google-places.component';
import {ProductListComponent} from "./product-list/product-list.component";
import {Slider3Component} from "./slider-3/slider-3.component";
import {DefaultNavbarComponent} from "./navbars/default-navbar/default-navbar.component";
import { Sidebar2Component } from './sidebar2/sidebar2.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    FooterComponent,
    EcommerceNavbarComponent,
    DefaultNavbarComponent,
    CategoryFiltersComponent,
    SliderComponent,
    AlertComponent,
    GooglePlacesComponent,
    ProductListComponent,
    Slider3Component,
    Sidebar2Component,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
    exports: [
        FooterComponent,
        EcommerceNavbarComponent,
      DefaultNavbarComponent,
        SliderComponent,
        AlertComponent,
      GooglePlacesComponent,
      Slider3Component,


    ]
})
export class ComponentsModule { }
