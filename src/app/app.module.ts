import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

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

// components for views and layouts

import { AdminNavbarComponent } from "./components/navbars/admin-navbar/admin-navbar.component";
import { AuthNavbarComponent } from "./components/navbars/auth-navbar/auth-navbar.component";
import { CardBarChartComponent } from "./components/cards/card-bar-chart/card-bar-chart.component";
import { CardLineChartComponent } from "./components/cards/card-line-chart/card-line-chart.component";
import { CardPageVisitsComponent } from "./components/cards/card-page-visits/card-page-visits.component";
import { CardProfileComponent } from "./components/cards/card-profile/card-profile.component";
import { CardSettingsComponent } from "./components/cards/card-settings/card-settings.component";
import { CardSocialTrafficComponent } from "./components/cards/card-social-traffic/card-social-traffic.component";
import { CardStatsComponent } from "./components/cards/card-stats/card-stats.component";
import { CardTableComponent } from "./components/cards/card-table/card-table.component";
import { FooterAdminComponent } from "./components/footers/footer-admin/footer-admin.component";
import { FooterSmallComponent } from "./components/footers/footer-small/footer-small.component";
import { HeaderStatsComponent } from "./components/headers/header-stats/header-stats.component";
import { IndexNavbarComponent } from "./components/navbars/index-navbar/index-navbar.component";
import { MapExampleComponent } from "./components/maps/map-example/map-example.component";
import { IndexDropdownComponent } from "./components/dropdowns/index-dropdown/index-dropdown.component";
import { TableDropdownComponent } from "./components/dropdowns/table-dropdown/table-dropdown.component";
import { PagesDropdownComponent } from "./components/dropdowns/pages-dropdown/pages-dropdown.component";
import { NotificationDropdownComponent } from "./components/dropdowns/notification-dropdown/notification-dropdown.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { UserDropdownComponent } from "./components/dropdowns/user-dropdown/user-dropdown.component";
import {EcommerceNavbarComponent} from "./components/navbars/ecommerce-navbar/ecommerce-navbar.component";
import {DefaultNavbarComponent} from "./components/navbars/default-navbar/default-navbar.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ProductListComponent} from "./components/ecommerce/products/product-list/product-list.component";
import {EcommerceComponent} from "./components/ecommerce/ecommerce.component";
import {ComponentsModule} from "./components/components.module";
import { ProjectsComponent } from './views/projects/projects.component';
import { ContactComponent } from './views/contact/contact.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from "./services/api/authentication.service";
import {ClientService} from "./services/api/client.service";
import {JwtInterceptor} from "./services/interceptors/jwt.interceptor";
import {ErrorInterceptor} from "./services/interceptors/error.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './views/home/home.component';
import { NgxPayPalModule } from 'ngx-paypal';
import {AuthAdminComponent} from "./layouts/auth_admin/auth-admin.component";
import {LoginAdminComponent} from "./views/auth/login-admin/login-admin.component";
import {RegisterAdminComponent} from "./views/auth/register-admin/register-admin.component";
import { ProductsComponent } from './views/admin/products/products.component';
import { EditProductComponent } from './views/admin/products/edit-product/edit-product.component';
import { CategoriesComponent } from './views/admin/categories/categories.component';
import { ClientsComponent } from './views/admin/clients/clients.component';
import { OrdersComponent } from './views/admin/orders/orders.component';
import { ChartsComponent } from './views/admin/charts/charts.component';
import { PaymentsComponent } from './views/admin/payments/payments.component';
import { SendingsComponent } from './views/admin/sendings/sendings.component';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardBarChartComponent,
    CardLineChartComponent,
    IndexDropdownComponent,
    PagesDropdownComponent,
    TableDropdownComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
    SidebarComponent,
    FooterSmallComponent,
    FooterAdminComponent,
    CardPageVisitsComponent,
    CardProfileComponent,
    CardSettingsComponent,
    CardSocialTrafficComponent,
    CardStatsComponent,
    CardTableComponent,
    HeaderStatsComponent,
    MapExampleComponent,
    AuthNavbarComponent,
    AdminNavbarComponent,
    IndexNavbarComponent,
    AdminComponent,
    MapsComponent,
    SettingsComponent,
    TablesComponent,
    AuthComponent,
    AuthAdminComponent,
    LoginComponent,
    RegisterComponent,
    LoginAdminComponent,
    RegisterAdminComponent,
    IndexComponent,
    LandingComponent,
    ProfileComponent,
    DefaultNavbarComponent,
    EcommerceComponent,
    ProjectsComponent,
    ContactComponent,
    HomeComponent,
    ProductsComponent,
    EditProductComponent,
    CategoriesComponent,
    ClientsComponent,
    OrdersComponent,
    ChartsComponent,
    PaymentsComponent,
    SendingsComponent,
  ],
  imports: [NgxPayPalModule,BrowserModule, AppRoutingModule, BrowserAnimationsModule, ComponentsModule, HttpClientModule,FormsModule, ReactiveFormsModule,SocialLoginModule],
  providers: [AuthenticationService, ClientService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '124147147180-roi438596d3n7af2o66bpj2oospc68fl.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule {}
