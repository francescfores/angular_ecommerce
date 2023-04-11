import {AfterViewInit, Component, EventEmitter, OnInit, Output, Renderer2} from "@angular/core";
import {first} from "rxjs/operators";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";

import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {of} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  public loginForm: UntypedFormGroup;
  loading = false;
  submited = false;

  //social login
  socialUser: SocialUser;
  //isLoggedin?: boolean;
  isLoggedin=false;
  declare  gapi: any;
  errorMessage: string;
  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    public socialAuthService: SocialAuthService,
    private toastr: ToastrService
  ) {
  }

  ngAfterViewInit():void{
    if (this.authenticationService.currentClientValue) {
      this.router.navigate(['/shop/products']);
    }
  }

  ngOnInit(): void {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password: new UntypedFormControl('', Validators.required)
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
      this.authenticationService.loginGoogle(this.socialUser.email, this.socialUser.idToken)
        //this.authenticationService.login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.router.navigate(['/shop/products']);
          },
          error => {
            //this.toastr.error('Invalid request', 'Toastr fun!');
            // this.loading = false;
          });
    });

  }

  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
  logOut(): void {
    this.socialAuthService.signOut();
  }

  get f() { return this.loginForm.controls; }
  logIn() {
    this.submited = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login('client_ecommerce@gmail.com', '123456')
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            this.router.navigate(['/shop/products']);
          },
          error => {
            this.loading = false;
            this.errorMessage = 'Invalid username or password';
            this.toastr.error(this.errorMessage);
          });
    } else {
      this.errorMessage = 'Email and password are required!';
      this.loading=false;
      this.toastr.error(this.errorMessage);
    }
  }
}
