import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {CartComponent} from "./cart.component";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {GoogleInitOptions, GoogleLoginProvider, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";
import {NgxPayPalModule} from "ngx-paypal";
import {NgxStripeModule, StripeCardComponent, StripeService} from "ngx-stripe";
import {Product, Variation} from "../../../models/product";
import {Cart} from "../../../models/cart";
import {By} from "@angular/platform-browser";
import {FormGroup} from "@angular/forms";
import {Observable, of} from "rxjs";
import {AddressService} from "../../../services/api/address.service";
import {AlertComponent} from "../../../components/alert/alert.component";
import {CarrierService} from 'src/app/services/api/carrier.service';
import {PaymentIntentResult, StripeCardElementOptions, StripeElementsOptions, TokenResult} from "@stripe/stripe-js";
import * as api from "@stripe/stripe-js/types/api";
import {HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../../../environments/environment";

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  const googleLoginOptions: GoogleInitOptions = { oneTapEnabled: false}// default is true };
  let addressService: AddressService;
  let carrierService: CarrierService;
  let stripeService: StripeService;
  let cart = new Cart();
  let httpMock: HttpTestingController;

  const product1 = new Variation();
  product1.id = 1;
  product1.price = 1000;
  product1.stock = 10;
  product1.img = '';
  product1.attributes = [];
  product1.product = new Product();
  product1.total = 10000;
  product1.new = false;
  product1.product.name = 'test';
  const product2 = new Variation();
  product2.id = 2;
  product2.price = 2000;
  product2.stock = 5;
  product2.img = '';
  product2.attributes = [];
  product2.product = new Product();
  product2.total = 2000;
  product2.new = false;
  product2.product.name = 'test';
  const product3 = new Variation();
  product3.id = 2;
  product3.price = 2000;
  product3.stock = 5;
  product3.img = '';
  product3.attributes = [];
  product3.product = new Product();
  product3.total = 2000;
  product3.new = false;
  product3.product.name = 'test';


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule,HttpClientModule,
        NgxStripeModule.forRoot('pk_test_51MdcD9G72AP1pY3usq8Eun6PO8buzaLm1nHdbu7KjxOQ6ms4Qxy3faW7BN8rhX8oBVFgS9dv3Lq12wLZHjGvXTLN00twOfb7EK'),
      ],
      declarations: [ CartComponent, AlertComponent ],
      providers: [
        AuthenticationService,
        AddressService,
        CarrierService,
        NgxPayPalModule,
        { provide: StripeService,
          //useValue: stripeServiceSpy
        },
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
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    addressService = TestBed.get(AddressService);
    carrierService = TestBed.get(CarrierService);
    stripeService = TestBed.get(StripeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /* step 1
     - get products from localStorage
     - group products and update subtotal correctly
     - should display products in the cart with the name, price, total and update subtotal correctly
     - remove products & display products in the car & update subtotal correctly
  */
  it('should get products from localStorage', () => {
    cart = new Cart()
    cart.products.push(product1, product2);
    localStorage.setItem('cart', JSON.stringify(cart));
    spyOn(component, 'getCartFromLocalStorage').and.callThrough();
    component.ngOnInit();
    expect(component.getCartFromLocalStorage).toHaveBeenCalled();
    expect(component.cart.products.length).toBe(2);
    expect(component.cart.products[0].price).toBe(1000);
    expect(component.cart.products[1].price).toBe(2000);
  });
  it('should group products and update total price', () => {
    cart = new Cart()
    cart.products.push(product1, product2,product3);
    component.cart = cart;
    component.totalPrice = 0;
    component.groupProducts();
    expect(component.groupedProducts.length).toBe(2);
    expect(component.groupedProducts[0].count).toBe(1);
    expect(component.groupedProducts[0].total).toBe(1000);
    expect(component.groupedProducts[1].count).toBe(2);
    expect(component.groupedProducts[1].total).toBe(4000);
    expect(component.totalPrice).toBe(5000);
  });
  // mostrar todos los productos agregados al carrito
  //  mostrar el nombre, precio, total de los productos en el carrito
  it('should display products in the cart with the name price and total', () => {
    cart = new Cart();

    cart.products.push(product1, product2);
    component.cart = cart;
    component.totalPrice = 0;
    component.groupProducts();
    fixture.detectChanges();

    const productElements = fixture.debugElement.queryAll(By.css('.cart-product'));
    expect(productElements.length).toBe(2);
    expect(productElements[0].nativeElement.textContent).toContain(product1.product.name);
    expect(productElements[0].nativeElement.textContent).toContain((product1.price/100).toFixed(2) + "€");
    expect(productElements[1].nativeElement.textContent).toContain(product2.product.name);
    expect(productElements[1].nativeElement.textContent).toContain((product2.price/100).toFixed(2) + "€")
    expect(productElements[1].nativeElement.textContent).toContain((product2.total/100).toFixed(2) + "€")

    const totalPriceElement = fixture.debugElement.query(By.css('#totalPrice_step1'));
    //expect(totalPriceElement.nativeElement.textContent).toContain('30.00€');
    expect(totalPriceElement.nativeElement.textContent).toContain((component.totalPrice/100).toFixed(2) + "€");
  });
  it('should remove products correctly & display products in the car', async () => {
    cart = new Cart();
    cart.products.push(product1, product2, product3);
    component.cart = cart;
    component.totalPrice = 0;
    component.groupProducts();
    component.step = 1;
    fixture.detectChanges();

    spyOn(component, 'removeProduct').and.callThrough(); // Espía la función "removeProduct" del componente y permite que la función real sea ejecutada
    const element = fixture.debugElement.query(By.css('#remove-' + product1.id)).nativeElement;
    element.click();

    fixture.detectChanges();
    expect(component.removeProduct).toHaveBeenCalled();

    expect(component.groupedProducts.length).toBe(1);
    expect(component.groupedProducts[0].id).toBe(2);
    expect(component.groupedProducts[0].count).toBe(2);
    expect(component.totalPrice).toBe(4000);

    //comprobamos si la vista se actualiza
    const productElements = fixture.debugElement.queryAll(By.css('.cart-product'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain(product2.product.name);
    expect(productElements[0].nativeElement.textContent).toContain((product2.price/100).toFixed(2) + "€")
    expect(productElements[0].nativeElement.textContent).toContain((product2.total/100).toFixed(2) + "€")

    const totalPriceElement = fixture.debugElement.query(By.css('#totalPrice_step1'));
    expect(totalPriceElement.nativeElement.textContent).toContain((component.totalPrice/100).toFixed(2) + "€");
  });
  it('should call step 2 function when button next step is clicked', () => {
    spyOn(component, 'goStep'); // Espía la función "login" del componente
    const element = fixture.debugElement.query(By.css('#step-1')).nativeElement; // Obtiene una referencia al botón de inicio de sesión
    element.click(); // Simula un clic en el botón de inicio de sesión
    expect(component.goStep).toHaveBeenCalled(); // Verifica que la función "login" del componente se haya llamado correctamente
  });
  /* step 2
    Paso 2: Dirección de envío
    - should call step 2 function when button next step is clicked
    - should have a address form
    - should have all fields
    - should show error if some field is empty
    - get countries successfully
    *Debería mostrar un formulario para ingresar la dirección de envío
    Debería mostrar un botón para ir al paso anterior
    *Debería mostrar un botón para ir al siguiente paso
    *Debería mostrar todos los campos del form
    *Debería mostrar un error si los campos del form están vacíos
    *Debería ir al siguente paso si los campos son correctos
  */
  it('should call step 2 function when button next step is clicked', () => {
    component.step=2
    fixture.detectChanges();
    spyOn(component, 'goStep'); // Espía la función "login" del componente
    const element = fixture.debugElement.query(By.css('#step-2')).nativeElement; // Obtiene una referencia al botón de inicio de sesión
    element.click(); // Simula un clic en el botón de inicio de sesión
    expect(component.goStep).toHaveBeenCalled(); // Verifica que la función "login" del componente se haya llamado correctamente
  });
  it('should have a address form', () => {
    component.step=2
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('#formPersonalData')).nativeElement;
    expect(element).toBeTruthy();
  });
  it('should have all fields', () => {
    component.step=2
    fixture.detectChanges();
    const name = fixture.debugElement.query(By.css('[formControlName="name"]')).nativeElement;
    const surnames = fixture.debugElement.query(By.css('[formControlName="surnames"]')).nativeElement;
    const dni = fixture.debugElement.query(By.css('[formControlName="dni"]')).nativeElement;
    const phone = fixture.debugElement.query(By.css('[formControlName="phone"]')).nativeElement;
    const address = fixture.debugElement.query(By.css('[formControlName="address"]')).nativeElement;
    const address_detail = fixture.debugElement.query(By.css('[formControlName="address_detail"]')).nativeElement;
    const notes = fixture.debugElement.query(By.css('[formControlName="notes"]')).nativeElement;
    const country = fixture.debugElement.query(By.css('[formControlName="country"]')).nativeElement;
    const postal_code = fixture.debugElement.query(By.css('[formControlName="postal_code"]')).nativeElement;
    const population = fixture.debugElement.query(By.css('[formControlName="population"]')).nativeElement;
    const province = fixture.debugElement.query(By.css('[formControlName="province"]')).nativeElement;
    expect(name).toBeTruthy();
    expect(surnames).toBeTruthy();
    expect(dni).toBeTruthy();
    expect(phone).toBeTruthy();
    expect(address).toBeTruthy();
    expect(address_detail).toBeTruthy();
    expect(notes).toBeTruthy();
    expect(country).toBeTruthy();
    expect(postal_code).toBeTruthy();
    expect(population).toBeTruthy();
    expect(province).toBeTruthy();
  });
  it('should show error if some field is empty', () => {
    component.step=2
    component.formPersonalData.controls['name'].setValue('');
    component.formPersonalData.controls['surnames'].setValue('');
    component.formPersonalData.controls['dni'].setValue('');
    component.formPersonalData.controls['phone'].setValue('');
    component.formPersonalData.controls['address'].setValue('');
    component.formPersonalData.controls['address_detail'].setValue('');
    component.formPersonalData.controls['notes'].setValue('');
    component.formPersonalData.controls['country'].setValue('');
    component.formPersonalData.controls['postal_code'].setValue('');
    component.formPersonalData.controls['population'].setValue('');
    component.formPersonalData.controls['province'].setValue('');

    fixture.detectChanges();
    component.goStep(3);
    expect(component.text).toEqual('Formulario invalido');
  });
  it('should get countries successfully', () => {
    const countries = [
      { id: 1, name: 'Country 1', provinces: [ { id: 1, name: 'Province 1' } ] },
      { id: 2, name: 'Country 2', provinces: [ { id: 2, name: 'Province 2' } ] }
    ];
    spyOn(addressService, 'getContries').and.returnValue(of({ data: countries }));
    component.ngOnInit();
    expect(component.countries).toEqual(countries);
    expect(component.country).toEqual(countries[0]);
    expect(component.provinces).toEqual(countries[0].provinces);
    expect(component.province).toEqual(countries[0].provinces[0]);
  });
  /*
    En este caso, se crea un spy para el método validAddress del servicio addressService, el cual retorna
    un observable con un objeto que contiene la propiedad addressComplete con valor true.
    Luego se asignan valores a las propiedades address, population y postal_code del formulario formPersonalData,
    así como a las propiedades country y province. Se crea una instancia del formulario y se establece el valor de la propiedad step en 2.

    Después se llama al método goStep(3) y se espera a que se complete la llamada al servicio validAddress. Finalmente se
    verifican que el método haya sido llamado con los parámetros correctos, que la propiedad show tenga valor true y que la propiedad
    text tenga el valor 'Direccion correcta'.
   */
  it('should validate address and set show and text properties', () => {

    const addressServiceSpy = spyOn(addressService, 'validAddress').and.returnValue(of({result: {verdict: {addressComplete: true}}}));
    const fpd = component.fpd;
    fpd.address.setValue('123 Main St.');
    fpd.population.setValue(10000);
    fpd.postal_code.setValue('12345');
    component.country = {id: 1, code: 'US', provinces: [{id: 1, name: 'New York'}]};
    component.province = {id: 1, name: 'New York'};
    component.formPersonalData = new FormGroup({
      address: fpd.address,
      population: fpd.population,
      postal_code: fpd.postal_code
    });
    component.step = 2;

    component.goStep(3);
    fixture.detectChanges();

    expect(addressServiceSpy).toHaveBeenCalledWith({
      address: '123 Main St.',
      country: 'US',
      province: 'New York',
      population: 10000,
      postal_code: '12345'
    });
    expect(component.step).toBe(3);
    expect(component.show).toBeTrue();
    expect(component.text).toBe('Direccion correcta');
  });
  /*
    Step 3 opciones de entrega:
    - should get carriers and display successfully
    - should update carrier and sub_total when a rate is selected and go to step 4
    - should error when go to step 4 if a rate is empty selected
    Verificar que se muestren todas las opciones de entrega disponibles.
    Verificar que el usuario pueda seleccionar una opción de entrega.
    Verificar que los costos de envío sean correctos y actualizados después de seleccionar una opción de envío.
   */
  it('should get carriers and display successfully', () => {
    const carriers = [
      {
        "id": 1,
        "created_at": "2023-03-10T14:28:23.000000Z",
        "updated_at": "2023-03-10T14:28:23.000000Z",
        "name": "España",
        "code": "es",
        "desc": "10",
        "provinces": [
          {
            "id": 1,
            "created_at": "2023-03-10T14:28:23.000000Z",
            "updated_at": "2023-03-10T14:28:23.000000Z",
            "name": "Tarragona",
            "code": "tar",
            "desc": "10",
            "country_id": 1
          },
          {
            "id": 2,
            "created_at": "2023-03-10T14:28:23.000000Z",
            "updated_at": "2023-03-10T14:28:23.000000Z",
            "name": "Girona",
            "code": "grn",
            "desc": "10",
            "country_id": 1
          }
        ]
      },
      {
        "id": 2,
        "created_at": "2023-03-10T14:28:23.000000Z",
        "updated_at": "2023-03-10T14:28:23.000000Z",
        "name": "Francia",
        "code": "fr",
        "desc": "10",
        "provinces": [
          {
            "id": 3,
            "created_at": "2023-03-10T14:28:23.000000Z",
            "updated_at": "2023-03-10T14:28:23.000000Z",
            "name": "París",
            "code": "par",
            "desc": "10",
            "country_id": 2
          }
        ]
      }
    ];
    spyOn(carrierService, 'getCarriers').and.returnValue(of({ data: carriers }));
    component.ngOnInit();
    expect(component.carriers).toEqual(carriers);
    //expect(component.carriers[0].code).toEqual('es');

    component.step=3;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('#delivery_options')).nativeElement;
    expect(element).toBeTruthy();
  });
  it('should update carrier and sub_total when a rate is selected and go to step 4', () => {
    const mockValue = {
      carrier_id: '123',
      carrier: 'Mock Carrier',
      rate: 100,
      delivery_days: 3
    };
    const expectedSubTotal = mockValue.rate + component.totalPrice;

    component.selectRate(mockValue);

    expect(component.carrier).toEqual(mockValue);
    expect(component.sub_total).toEqual(expectedSubTotal);
    component.goStep(4);
    expect(component.step).toBe(4);
  });
  it('should error when go to step 4 if a rate is empty selected', () => {
    component.goStep(4);
    expect(component.text).toEqual('Selecciona una opcion de entrega');
  });
  /*
    Step 4 Método de pago:
   */
  it('should display payment metod form', () => {
    component.step=4;
    const element = fixture.debugElement.query(By.css('#payment_metod')).nativeElement;
    expect(element).toBeTruthy();
  });
  it('should display stripe_card', () => {
    component.step=4;
    const element = fixture.debugElement.query(By.css('#stripe_card')).nativeElement;
    expect(element).toBeTruthy();
  });
  it('should click confirm payment metod', () => {
    component.step=4;
    spyOn(component, 'goStep');
    const element = fixture.debugElement.query(By.css('#comfirm_payment')).nativeElement;
    element.click(); // Simula un clic en el botón de inicio de sesión
    expect(component.goStep).toHaveBeenCalled(); // Ver
  });
  /*
     Step 5 Resumen:
     Verificar que los detalles de la orden sean correctos (productos, cantidad, precio, dirección de envío, opción de entrega y método de pago).
     Verificar que el botón "confirmar pedido" lleve al usuario a una página de confirmación de pedido.
     Verificar que el botón "editar" permita al usuario volver a las etapas anteriores y editar los detalles de la orden.
    */
  it('should display resum', () => {
    component.step=5;
    component.carrier.rate=5;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('#resum')).nativeElement;
    expect(element).toBeTruthy();
  });

//tok_1MmGdgG72AP1pY3uWj4R6DYf
});




