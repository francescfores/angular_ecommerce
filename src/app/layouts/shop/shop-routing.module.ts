import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import {AuthGuard} from "../../services/guards/auth.guard";
import {NonAuthGuard} from "../../services/guards/non-auth.guard";

const routes: Routes = [

  {
    path: '',
    component: IndexComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('../../views/pages/shop.module').then(m => m.ShopModule),
      }
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
