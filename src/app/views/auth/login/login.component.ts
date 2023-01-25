import {AfterViewInit, Component, EventEmitter, OnInit, Output, Renderer2} from "@angular/core";
import {first} from "rxjs/operators";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, AfterViewInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  public loginForm: UntypedFormGroup;
  loading = false;
  submited = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
  }
  ngAfterViewInit():void{
    if (this.authenticationService.currentClientValue) {
      this.router.navigate(['/shop/products']);
    }
  }

  ngOnInit(): void {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', Validators.required)
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
      this.authenticationService.login(this.f.email.value, this.f.password.value)
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
    } else {
      //this.toastr.error('Invalid form!', 'Toastr fun!');
    }
  }
}
