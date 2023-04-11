import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {IndexComponent} from './index/index.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {RouterOutlet} from "@angular/router";
import {ComponentsModule} from "../../components/components.module";
import {AuthRoutingModule} from "./auth-routing.module";
import {
  GoogleInitOptions,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig
} from "@abacritt/angularx-social-login";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginAdminComponent} from "./login-admin/login-admin.component";
import {RegisterAdminComponent} from "./register-admin/register-admin.component";

const googleLoginOptions: GoogleInitOptions = { oneTapEnabled: false}// default is true };


@NgModule({
  declarations: [IndexComponent, LoginComponent, RegisterComponent, LoginAdminComponent, RegisterAdminComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    ComponentsModule,
    AuthRoutingModule,
    GoogleSigninButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [IndexComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '124147147180-roi438596d3n7af2o66bpj2oospc68fl.apps.googleusercontent.com',
              googleLoginOptions ),
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
  ]
})
export class AuthModule { }
