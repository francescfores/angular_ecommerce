import {AfterViewInit, Component, EventEmitter, OnInit, Output, Renderer2} from "@angular/core";
import {first} from "rxjs/operators";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: "app-login-admin",
  templateUrl: "./login-admin.component.html",
})
export class LoginAdminComponent implements OnInit, AfterViewInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  public loginForm: UntypedFormGroup;
  loading = false;
  submited = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }
  ngAfterViewInit():void{
    if (this.authenticationService.currentClientValue) {
      //this.router.navigate(['/shop/products']);
    }
  }

  ngOnInit(): void {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('superadmin@gmail.com', Validators.required),
      password: new UntypedFormControl('123456', Validators.required)
    });
  }

  get f() { return this.loginForm.controls; }
  logIn() {
    this.submited = true;
    console.log(this.loginForm.valid);

    // this.router.navigate(['/']);
    if (this.loginForm.valid) {
      console.log('data');
      // this.appService.login();
      this.loading = true;
      // this.authenticationService.loginUser('superadmin@gmail.com', '123456')
      this.authenticationService.loginUser(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.router.navigate(['/admin/dashboard']);
          },
          error => {
            this.loading = false;
            //this.errorMessage = 'Invalid username or password';
            this.toastr.error('Invalid username or password');
          });
    } else {
      //this.errorMessage = 'Email and password are required!';
      this.loading=false;
      this.toastr.error('Email and password are required!');
    }
  }

  register() {

  }
}
