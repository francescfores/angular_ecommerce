import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// admin views
import { DashboardComponent } from "./views/admin/dashboard/dashboard.component";
import { MapsComponent } from "./views/admin/maps/maps.component";
import { SettingsComponent } from "./views/admin/settings/settings.component";
import { TablesComponent } from "./views/admin/tables/tables.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";
import {EcommerceComponent} from "./components/ecommerce/ecommerce.component";
import {ProductListComponent} from "./components/ecommerce/products/product-list/product-list.component";
import {ContactComponent} from "./views/contact/contact.component";
import {ProjectsComponent} from "./views/projects/projects.component";

import {NonAuthGuard} from './services/guards/non-auth.guard';
import {HomeComponent} from "./views/home/home.component";
import {AuthAdminComponent} from "./layouts/auth_admin/auth-admin.component";
import {LoginAdminComponent} from "./views/auth/login-admin/login-admin.component";
import {RegisterAdminComponent} from "./views/auth/register-admin/register-admin.component";
import {ProductsComponent} from "./views/admin/products/products.component";
import {EditProductComponent} from "./views/admin/products/edit-product/edit-product.component";
import {CategoriesComponent} from "./views/admin/categories/categories.component";
import {ClientsComponent} from "./views/admin/clients/clients.component";
import {OrdersComponent} from "./views/admin/orders/orders.component";
import {ChartsComponent} from "./views/admin/charts/charts.component";
import {PaymentsComponent} from "./views/admin/payments/payments.component";

const routes: Routes = [
  { path: 'shop', loadChildren: () => import('./layouts/shop/shop.module').then(m => m.ShopModule) },
  // admin views
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "profile", component: ProfileComponent },
      { path: "products", component: ProductsComponent },
      { path: "edit-product", component: EditProductComponent },
      { path: "categories", component: CategoriesComponent },
      { path: "clients", component: ClientsComponent },
      { path: "orders", component: OrdersComponent },
      { path: "charts", component: ChartsComponent },
      { path: "payments", component: PaymentsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  // auth views
  {
    path: "auth",
    component: AuthComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  {
    path: "auth-admin",
    component: AuthAdminComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      { path: "login", component: LoginAdminComponent },
      { path: "register", component: RegisterAdminComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  {
    path: "ecommerce",
    component: EcommerceComponent,
    children: [
      { path: "products", component: ProductListComponent },
    ],
  },
  // no layout viewsv
  { path: "projects", component: ProjectsComponent },
  { path: "contact", component: ContactComponent },
  { path: "", component: HomeComponent },
  { path: "profile", component: ProfileComponent },
  { path: "landing", component: LandingComponent },
  //{ path: "home", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {}
