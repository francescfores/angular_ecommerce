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

const routes: Routes = [
  { path: 'shop', loadChildren: () => import('./layouts/shop/shop.module').then(m => m.ShopModule) },
  // admin views
  /*
  {
    path: "admin",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "settings", component: SettingsComponent },
      { path: "tables", component: TablesComponent },
      { path: "maps", component: MapsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
   */
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
    path: "ecommerce",
    component: EcommerceComponent,
    children: [
      { path: "products", component: ProductListComponent },
    ],
  },
  // no layout views
  { path: "projects", component: ProjectsComponent },
  { path: "contact", component: ContactComponent },
  { path: "profile", component: ProfileComponent },
  { path: "landing", component: LandingComponent },
  { path: "", component: IndexComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
