import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../../services/guards/auth.guard';
import {ProductsPageComponent} from './pages/products/products-page.component';
import {ProductDetailComponent} from './pages/product-detail/product-detail.component';
import {ProfileClientComponent} from './pages/profile-client/profile-client.component';
import {CartComponent} from './pages/cart/cart.component';
import {CardComponent} from './pages/card/card.component';
import {IndexComponent} from './index/index.component';
import {NonAuthGuard} from '../../services/guards/non-auth.guard';
import {HomeComponent} from './pages/home/home.component';
import {ContactComponent} from './pages/contact/contact.component';

const routes: Routes = [

  {
    path: '',
    component: IndexComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      {
        path: '',
        component: ProductsPageComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'products',
        component: ProductsPageComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'product-detail',
        component: ProductDetailComponent
      },
      {
        path: 'profile',
        component: ProfileClientComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'card',
        component: CardComponent
      },
      {
        path: 'cart',
        component: CartComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
