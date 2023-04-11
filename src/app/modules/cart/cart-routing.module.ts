import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../../services/guards/auth.guard';
import {CartComponent} from './pages/cart/cart.component';
import {IndexComponent} from './index/index.component';
import {NonAuthGuard} from '../../services/guards/non-auth.guard';
import {ShoppingBasketComponent} from './pages/shopping-basket/shopping-basket.component';
import {AddressComponent} from "./pages/address/address.component";
import {ShippingComponent} from "./pages/shipping/shipping.component";
import {PaymentComponent} from "./pages/payment/payment.component";
import {SummaryComponent} from "./pages/summary/summary.component";

const routes: Routes = [

  {
    path: '',
    component: IndexComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      {
        path: 'shopping-basket',
        component: ShoppingBasketComponent
      },
      {
        path: 'address',
        component: AddressComponent
      },
      {
        path: 'shipping',
        component: ShippingComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'summary',
        component: SummaryComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
