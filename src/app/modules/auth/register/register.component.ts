import {AfterViewInit, Component, EventEmitter, OnInit, Output} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {first} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  public loginForm: UntypedFormGroup;
  loading = false;
  submited = false;
  private errorMessage: string;

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
      email: new UntypedFormControl('client_ecommerce@gmail.com',
        [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password: new UntypedFormControl('123456', Validators.required),
      repeat_password: new UntypedFormControl('123456', Validators.required),
      nick: new UntypedFormControl('test', Validators.required)
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
      this.authenticationService.login('client_ecommerce@gmail.com', '123456')
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
    } else {
      //this.toastr.error('Invalid form!', 'Toastr fun!');
    }
  }

  register() {
    this.submited = true;
    if (this.loginForm.valid) {
      if(this.f.password.value !== this.f.repeat_password.value){
        this.errorMessage = 'Passwords do not match!';
        this.toastr.error(this.errorMessage);
      }else{
        console.log('data');
        let data = {
          nick:this.f.nick.value,
          email:this.f.email.value,
          password:this.f.password.value
        }
        this.loading = true;
        this.authenticationService.register(data)
          .pipe(first())
          .subscribe(
            res => {
              console.log(res);
              this.loading = false;
              this.router.navigate(['/shop/products']);
            },
            error => {
              this.errorMessage = 'Invalid email or password';
              this.toastr.error(this.errorMessage);
              this.loading=false;
            });
      }
    } else {
      this.loading=false;
      this.errorMessage = 'Email and password are required!';
      if(this.f.email.errors.pattern){
        this.errorMessage = 'Email not valid!';
      }
      this.toastr.error(this.errorMessage);
    }
  }
}
