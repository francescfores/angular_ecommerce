import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../../services/api/authentication.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  GoogleInitOptions
} from '@abacritt/angularx-social-login';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {async, of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {By} from "@angular/platform-browser";
import {Client} from "../../../models/client";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authenticationService: AuthenticationService;
  const googleLoginOptions: GoogleInitOptions = { oneTapEnabled: false}// default is true };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule,HttpClientModule ],
      declarations: [ LoginComponent ],
      providers: [ AuthenticationService, {
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
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.get(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form', () => {
    const element = fixture.debugElement.query(By.css('form')).nativeElement;
    //const element = fixture.debugElement.query(By.css('[formGroup="loginForm"]')).nativeElement;
    expect(element).toBeTruthy();
  });

  it('should have email and password fields', () => {
    /* with id use
      const emailElement = fixture.debugElement.query(By.css('#email')).nativeElement;
      const passwordElement = fixture.debugElement.query(By.css('#password')).nativeElement;
    */
    const emailElement = fixture.debugElement.query(By.css('[formControlName="email"]')).nativeElement;
    const passwordElement = fixture.debugElement.query(By.css('[formControlName="password"]')).nativeElement;
    expect(emailElement).toBeTruthy();
    expect(passwordElement).toBeTruthy();
  });

  it('should have a submit button', () => {
    const element = fixture.debugElement.query(By.css('#loginButton')).nativeElement;
    expect(element).toBeTruthy();
  });
  it('should show error if email or password is empty', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.logIn();
    expect(component.errorMessage).toEqual('Email and password are required!');
  });

  it('should call login function when login button is clicked', () => {
    spyOn(component, 'logIn'); // Espía la función "login" del componente
    const element = fixture.debugElement.query(By.css('#loginButton')).nativeElement; // Obtiene una referencia al botón de inicio de sesión
    element.click(); // Simula un clic en el botón de inicio de sesión
    expect(component.logIn).toHaveBeenCalled(); // Verifica que la función "login" del componente se haya llamado correctamente
  });

  it('should call authenticationService.login on login controller', () => {
    spyOn(authenticationService, 'login').and.returnValue(of(new Client()));
    component.loginForm.controls['email'].setValue('client_ecommerce@gmail.com');
    component.loginForm.controls['password'].setValue('123456');
    // simulamos un envío de formulario
    component.logIn();
    expect(authenticationService.login).toHaveBeenCalled(); // aseguramos que se haya llamado a la función login del servicio
  });

  it('should navigate to products page on successful login', () => {
    const navigateSpy = spyOn(component.router, 'navigate');
    spyOn(authenticationService, 'login').and.returnValue(of(new Client()));
    component.loginForm.controls['email'].setValue('client_ecommerce@gmail.com');
    component.loginForm.controls['password'].setValue('123456');
    component.logIn();
    expect(authenticationService.login).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/shop/products']);
  });
  /*
    it('should show error message on failed login due to invalid credentials', () => {
       spyOn(window, 'alert');
       spyOn(authenticationService, 'login').and.returnValue(throwError('Invalid credentials'));
       const credentials = {
         email: 'user@example.com',
         password: 'password'
       };
       component.onSubmit(credentials);
       expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
     });

     it('should show error message on failed login due to server error', () => {
       spyOn(window, 'alert');
       spyOn(authenticationService, 'login').and.returnValue(throwError('Server Error'));
       const credentials = {
         email: 'user@example.com',
         password: 'password'
       };
       component.onSubmit(credentials);
       expect(window.alert).toHaveBeenCalledWith('Server Error');
     });

     it('should disable submit button and show loading indicator while processing login request', () => {
       spyOn(authenticationService, 'login').and.returnValue(of(true));
       const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
       const loadingIndicator = fixture.debugElement.query(By.css('#loading-indicator')).nativeElement;
       expect(submitButton.disabled).toBeFalsy();
       expect(loadingIndicator).toBeFalsy();
       component.onSubmit({
         email: 'user@example.com',
         password: 'password'
       });
       expect(submitButton.disabled).toBeTruthy();
       expect(loadingIndicator).toBeTruthy();
     });

     it('should reset form after failed login', () => {
       spyOn(authenticationService, 'login').and.returnValue(throwError('Invalid credentials'));
       const emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
       const passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
       emailInput.value = 'user@example.com';
       passwordInput.value = 'password';
       component.onSubmit({
         email: emailInput.value,
         password: passwordInput.value
       });
       expect(emailInput.value).toBe('');
       expect(passwordInput.value).toBe('');
     });

     it('should show loading screen while login request is processing', () => {
       spyOn(authenticationService, 'login').and.returnValue(of(true));
       const loadingScreen = fixture.debugElement.query(By.css('#loading-screen')).nativeElement;
       expect(loadingScreen).toBeFalsy();
       component.onSubmit({
         email: 'user@example.com',
         password: 'password'
       });
       expect(loadingScreen).toBeTruthy();
     });
   */
  /*
  it('should allow user to logout', () => {
    spyOn(authenticationService, 'logout');
    component.logOut();
    expect(authenticationService.logout).toHaveBeenCalled();
  });
  */
});
