import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {AddressService} from '../../../../services/api/address.service';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../services/shared/cart.service';
import {Cart} from "../../../../models/cart";
import {ClientService} from "../../../../services/api/client.service";
import {Client} from "../../../../models/client";
import {AuthenticationService} from "../../../../services/api/authentication.service";
import {Address} from "../../../../models/address";


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, AfterViewInit{
  @Output() validChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  private valid=false;

  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  cart: Cart;
  success=false;
  countries: any;
  country: any;
  provinces: any;
  province: any;
  client: any;
  loading=true;
  submitted=false;

  formPersonalData: FormGroup;
  public addressForm: UntypedFormGroup;
  public editAddressForm: UntypedFormGroup;
  create_address: boolean;
  private address: Address;
  edit_address: boolean;
  selected_address: any;
  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private toastr: ToastrService,
    private cartService: CartService,
    private clientService: ClientService,
    private authenticationService: AuthenticationService,
    private renderer: Renderer2,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.client=new Client();
    this.address = new Address();

  }
  get fa() {
    return this.addressForm.controls;
  }
  get fea() {
    return this.editAddressForm.controls;
  }
  ngOnInit(): void {
    //this.cartService.setAddressValid(false);
    this.loading=true;
    this.formPersonalData = this.fb.group({
      name: ['f', [Validators.required]],
      surnames: ['f', [Validators.required]],
      dni: ['34', [Validators.required]],
      phone: ['64', [Validators.required]],
      address: ['Carre illa de genova n8', [Validators.required]],
      address_detail: ['3b', [Validators.required]],
      notes: ['No tengo timbre', [Validators.required]],
      country: ['España', [Validators.required]],
      postal_code: ['43500', [Validators.required]],
      population: ['Tortosa', [Validators.required]],
      province: ['Tarragona', [Validators.required]],
    });
    this.addressService.getContries().subscribe({
      next: res => {
        console.log('¡sdddddddddddddddddddddddddddddd')
        console.log(res)
        console.log(res.data)
        //this.countries =res.data;
        //this.country = this.countries.find(x=>x.id===this.countries[0].id);
        //this.provinces= this.country.provinces;
        //this.province= this.country.provinces[0];
        this.getClientById();

        // this.fpd.country.setValue(this.country.id);
        // this.fpd.province.setValue(this.provinces[0].id);
      },
      error: (err: any) => {
        this.loading = false;
      },
      complete: () => { }
    });
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      console.log('this.cart',this.cart)

    });
    this.client =this.authenticationService.currentClientValue;

  }

  get fpd() {
    return this.formPersonalData.controls;
  }

  ngAfterViewInit(): void {
    //const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    if(this.create_address){

    }
  }
  handleAddressChange() {
    const place = this.searchElementRef.nativeElement.value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: place }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const addressObject = this.searchElementRef.nativeElement.value;
        const address = addressObject.split(',')[0]; // Esta línea es para mostrar solo la calle
        if(this.create_address){
          this.fa.address.setValue(address);
        }
        if(this.edit_address){
          this.fea.address.setValue(address);
        }
        console.log(address);
        this.searchElementRef.nativeElement.value = address;

        const location = results[0].geometry.location;
        // Aquí puedes acceder a los datos de la ubicación, como la latitud y longitud
        console.log('Dirección completa:', results[0].formatted_address);
        console.log('Latitud:', location.lat());
        console.log('Longitud:', location.lng());

        const addressComponents = results[0].address_components;
        const streetComponent = addressComponents.find(component => component.types.includes('route'));

        if (streetComponent) {
          const street = streetComponent.long_name;
          console.log('Calle:', street);
        } else {
          console.error('No se encontró la calle en la dirección:', results[0].formatted_address);
        }

      } else {
        console.error('Error al obtener la ubicación:', status);
      }
    });
  }

  goToNextStep(){
    this.submitted = true;
    this.loading=true;
    //shippypro
    /*
    this.addressService.getRates().subscribe({
      next: res => {
        this.rates =res.Rates;
      },
      error: (err: any) => {
        this.loading = false;
      },
      complete: () => { }
    });
    */

    // if (this.formPersonalData.valid){
      console.log('eee')
      this.cart.shipping=this.selected_address;
      // this.cart.shipping= {
      //   //carrier:this.carrier,
      //   name:this.fpd.name.value,
      //   surnames:this.fpd.surnames.value,
      //   dni:this.fpd.dni.value,
      //   phone:this.fpd.phone.value,
      //   address:this.fpd.address.value,
      //   address_detail:this.fpd.address_detail.value,
      //   notes:this.fpd.notes.value,
      //   country:this.country,
      //   zip:this.fpd.postal_code.value,
      //   city:this.fpd.population.value,
      //   province:this.province
      // };
      this.cartService.updateCart(this.cart);
      this.loading=false;
      this.cartService.setAddressValid(true);
      this.cartService.goStep(3);
      /*
      //shippypro
      this.addressService.validAddress({
        address:this.fpd.address.value,
        country:this.country.code,
        province:this.province.name,
        population:this.fpd.population.value,
        postal_code:this.fpd.postal_code.value,
      })
        .pipe(first())
        .subscribe(
          res => {
            //validar mejor la url ejemplo Administrative area level (provincia)
            if(res.result.verdict?.addressComplete){
              this.show=true;
              this.text='Direccion correcta'
              this.color='success'
              this.step=step;
              this.submitted = false;
              this.getCarriers();
            }else{
              this.show=true;
              this.text='Direccion invalida'
              this.color='danger'
              this.submitted = false;
            }
            //this.loading=false;
//          this.router.navigate(['/shop/products']);
          },
          error => {
            this.loading=false;
            this.text='error'
          });*/
    // } else {
    //   console.log('eesssssssssssssse')
    //   this.toastr.info('Invalid form');
    //   this.loading=false;
    // }
  }

  getClientById(){
    this.clientService.getClientById(this.client.id)
      .pipe(first())
      .subscribe(
        data => {
          if (this.cart.shipping!=null){
            console.log('!null')
          }else {
            console.log('null')
          }
          this.client = data.data;
          this.selected_address = this.client.addresses[0];
          console.log(this.client.addresses[0]);
          this.selectAddress(this.selected_address);
          console.log(data);
          this.loading = false;
        },
        error => {
        });
  }

  createAddress() {
    this.submitted = true;
    this.loading=true;
    if (this.addressForm.valid) {
      this.address.name = this.fa.name.value;
      this.address.surnames = this.fa.surnames.value;
      this.address.dni = this.fa.dni.value;
      this.address.phone = this.fa.phone.value;
      this.address.address = this.fa.address.value;
      this.address.address_detail = this.fa.address_detail.value;
      this.address.notes = this.fa.notes.value;
      this.address.country = this.fa.country.value;
      this.address.city = this.fa.city.value;
      this.address.province = this.fa.province.value;
      this.address.zip = this.fa.zip.value;
      this.address.client =this.client.id;

      this.addressService.createByClient(this.address)
        .pipe(first())
        .subscribe(
          res => {
            this.submitted = false;
            this.loading=false;
            console.log(res.data);
            this.getClientById();
            this.create_address=false;
          },
          error => {
            this.loading = false;
          });
    } else {
      this.loading=false;
    }
  }
  openCreateAddress() {
    this.create_address=true;

    this.addressForm = this.formBuilder.group({
      name: ['', Validators.required],
      surnames: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_detail: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      zip: ['', [Validators.required]],

    });
    this.fa.country.setValue(this.country.id);
    this.fa.province.setValue(this.provinces[0].id);
    setTimeout(() => {
      if (this.searchElementRef) {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['address']
        });
        autocomplete.addListener('place_changed', () => {
          this.handleAddressChange();
        });
      }
    }, 0);
  }
  deleteAddress(address) {
    this.addressService.delete(address.id)
      .pipe(first())
      .subscribe(
        res => {
          this.submitted = false;
          this.loading=false;
          console.log(res.data);
          this.getClientById();
        },
        error => {
          this.loading = false;
        });
  }

  openEditAddress(address: any) {
    this.edit_address=true;
    this.editAddressForm = this.formBuilder.group({
      id: [address.id, Validators.required],
      name: [address.name, Validators.required],
      surnames: [address.surnames, [Validators.required]],
      dni: [address.dni, [Validators.required]],
      phone: [address.phone, [Validators.required]],
      address: [address.address, [Validators.required]],
      address_detail: [address.address_detail, [Validators.required]],
      notes: [address.notes, [Validators.required]],
      country: [address.country, [Validators.required]],
      city: [address.city, [Validators.required]],
      province: [address.province, [Validators.required]],
      zip: [address.zip, [Validators.required]],
    });
    setTimeout(() => {
      if (this.searchElementRef) {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['address']
        });
        autocomplete.addListener('place_changed', () => {
          this.handleAddressChange();
        });
      }
    }, 0);

  }

  editAddress() {
    this.submitted = true;
    this.loading=true;
    if (this.editAddressForm.valid) {
      this.address.id = this.fea.id.value;
      this.address.name = this.fea.name.value;
      this.address.surnames = this.fea.surnames.value;
      this.address.dni = this.fea.dni.value;
      this.address.phone = this.fea.phone.value;
      this.address.address = this.fea.address.value;
      this.address.address_detail = this.fea.address_detail.value;
      this.address.notes = this.fea.notes.value;
      this.address.country = this.fea.country.value;
      this.address.city = this.fea.city.value;
      this.address.province = this.fea.province.value;
      this.address.zip = this.fea.zip.value;

      this.addressService.update(this.address.id, this.address)
        .pipe(first())
        .subscribe(
          res => {
            this.submitted = false;
            this.loading=false;
            console.log(res.data);
            this.getClientById();
            this.edit_address=false;
          },
          error => {
            this.loading = false;
          });
    } else {
      this.loading=false;
    }
  }

  selectAddress(address: any) {
    console.log(address);
    if(address){
      this.selected_address = address;
      //this.selected_address.country= this.countries.find(x=>x.id===Number(address.country));
      //this.selected_address.province= this.provinces.find(x=>x.id===Number(address.province));
      console.log(this.selected_address)
    }
  }

  selectCountry($event: any) {
    this.country = this.countries.find(x=>x.id===Number($event.target.value));
    if (this.country !== undefined) {
      this.provinces= this.country.provinces;
      //TODO set form address
    }
  }
  selectProvince($event: any) {
    this.province = this.provinces.find(x=>x.id===Number($event.target.value));
    if (this.province !== undefined) {
      //TODO set form address
    }
  }


}

