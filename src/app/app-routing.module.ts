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
import {EcommerceComponent} from "./components/ecommerce/ecommerce.component";
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
import {AuthGuard} from "./services/guards/auth.guard";
import {TaxesComponent} from "./views/admin/taxes/taxes.component";
import {EditCategoryComponent} from "./views/admin/categories/edit-category/edit-category.component";
import {EditSubcategoryComponent} from "./views/admin/categories/edit-subcategory/edit-subcategory.component";
import {EditSupercategoryComponent} from "./views/admin/categories/edit-supercategory/edit-supercategory.component";
import {SendingsComponent} from "./views/admin/sendings/sendings.component";
import {EditOrderComponent} from "./views/admin/orders/edit-order/edit-order.component";
import {AttributesComponent} from "./views/admin/attributes/attributes.component";
import {EditAttributeComponent} from "./views/admin/attributes/edit-attribute/edit-attribute.component";
import {EditPaymentComponent} from "./views/admin/payments/edit-payment/edit-payment.component";
import {EditSendingComponent} from "./views/admin/sendings/edit-sending/edit-sending.component";
import {CarriersComponent} from "./views/admin/carriers/carriers.component";
import {EditCarrierComponent} from "./views/admin/carriers/edit-carrier/edit-carrier.component";
import {UsersComponent} from "./views/admin/users/users.component";
import {EditUserComponent} from "./views/admin/users/edit-user/edit-user.component";

const routes: Routes = [
  {
    // canActivate: [NonAuthGuard],
    // canActivateChild: [NonAuthGuard],
    path: '',
    loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule)
  },
  {
    // canActivate: [NonAuthGuard],
    // canActivateChild: [NonAuthGuard],
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule)
  },
  {
    // canActivate: [NonAuthGuard],
    // canActivateChild: [NonAuthGuard],
    path: 'auth2',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  // admin views
  {
    path: "admin",
    component: AdminComponent,
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    data: {
      roles: ['superadmin','admin']
    },
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      //{ path: "profile", component: ProfileComponent },
      { path: "products", component: ProductsComponent },
      { path: "edit-product", component: EditProductComponent },
      { path: "edit-category", component: EditCategoryComponent },
      { path: "edit-subcategory", component: EditSubcategoryComponent },
      { path: "edit-supercategory", component: EditSupercategoryComponent },
      { path: "categories", component: CategoriesComponent },
      { path: "attributes", component: AttributesComponent },
      { path: "edit-attribute", component: EditAttributeComponent },
      { path: "clients", component: ClientsComponent },
      { path: "orders", component: OrdersComponent },
      { path: "edit-order", component: EditOrderComponent },
      { path: "charts", component: ChartsComponent },
      { path: "payments", component: PaymentsComponent },
      { path: "edit-payment", component: EditPaymentComponent },
      { path: "taxes", component: TaxesComponent },
      { path: "sendings", component: SendingsComponent },
      { path: "edit-sendings", component: EditSendingComponent },
      { path: "carriers", component: CarriersComponent },
      { path: "edit-carrier", component: EditCarrierComponent },
      { path: "users", component: UsersComponent },
      { path: "edit-user", component: EditUserComponent },

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
  // {
  //   path: "ecommerce",
  //   component: EcommerceComponent,
  //   children: [
  //     { path: "products", component: ProductListComponent },
  //   ],
  // },
  // no layout viewsv
  { path: "projects", component: ProjectsComponent },
  { path: "contact", component: ContactComponent },
  // { path: "", component: HomeComponent },
  {
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    path: '',
    loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule)
  },
  { path: "landing", component: LandingComponent },
  //{ path: "home", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {}
