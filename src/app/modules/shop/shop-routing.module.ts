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
import {Home1Component} from './pages/homes/home1/home1.component';
import {Home2Component} from './pages/homes/home2/home2.component';
import {Home3Component} from './pages/homes/home3/home3.component';
import {Home4Component} from './pages/homes/home4/home4.component';
import {Home5Component} from './pages/homes/home5/home5.component';
import {Home6Component} from './pages/homes/home6/home6.component';
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
        path: 'home1',
        
        component: Home1Component
      },
      {
        path: 'home2',
        
        component: Home2Component
      },
      {
        path: 'home3',
        
        component: Home3Component
      },
      {
        path: 'home4',
        
        component: Home4Component
      },
      {
        path: 'home5',
        
        component: Home5Component
      },
      {
        path: 'home6',
        
        component: Home6Component
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
