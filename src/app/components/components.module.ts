import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FooterComponent} from './footers/footer/footer.component';
import {EcommerceNavbarComponent} from './navbars/ecommerce-navbar/ecommerce-navbar.component';
import {RouterModule} from "@angular/router";
import { CategoryFiltersComponent } from './category-filters/category-filters.component';
import { SliderComponent } from './slider/slider.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    FooterComponent,
    EcommerceNavbarComponent,
    CategoryFiltersComponent,
    SliderComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
    exports: [
        FooterComponent,
        EcommerceNavbarComponent,
        SliderComponent,
        AlertComponent
    ]
})
export class ComponentsModule { }
