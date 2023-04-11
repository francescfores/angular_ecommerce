import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../../services/guards/auth.guard';
import {IndexComponent} from './index/index.component';
import {NonAuthGuard} from '../../services/guards/non-auth.guard';
import {LoginComponent} from "./login/login.component";
import {AuthComponent} from "../../layouts/auth/auth.component";
import {RegisterComponent} from "./register/register.component";
import {LoginAdminComponent} from "./login-admin/login-admin.component";
import {RegisterAdminComponent} from "./register-admin/register-admin.component";
import {AuthAdminComponent} from "../../layouts/auth_admin/auth-admin.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ]
  },
  {
    path: "admin",
    component: IndexComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      { path: "login", component: LoginAdminComponent },
      { path: "register", component: RegisterAdminComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
