import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FooterComponent} from './footers/footer/footer.component';
import {EcommerceNavbarComponent} from './navbars/ecommerce-navbar/ecommerce-navbar.component';
import {RouterModule} from "@angular/router";
import { CategoryFiltersComponent } from './category-filters/category-filters.component';

@NgModule({
  declarations: [
    FooterComponent,
    EcommerceNavbarComponent,
    CategoryFiltersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    FooterComponent,
    EcommerceNavbarComponent
  ]
})
export class ComponentsModule { }
