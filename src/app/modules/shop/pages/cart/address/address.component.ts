import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AddressService} from "../../../../../services/api/address.service";
import {first} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, AfterViewInit{
  formPersonalData: FormGroup;
  submitted = false;
  @Output() validChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('search') public searchElementRef: ElementRef;

  loading=true;
  success=false;
  countries: any;
  country: any;
  provinces: any;
  province: any;
  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
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
        this.countries =res.data;
        this.country = this.countries.find(x=>x.id===this.countries[0].id);
        this.provinces= this.country.provinces;
        this.province= this.country.provinces[0];
        this.fpd.country.setValue(this.country.id);
        this.fpd.province.setValue(this.provinces[0].id);
        this.loading=false;
      },
      error: (err: any) => {
        this.loading = false;
      },
      complete: () => { }
    });
    //const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ['address']
    });
    autocomplete.addListener('place_changed', () => {
      this.handleAddressChange();
    });
  }

  get fpd() {
    return this.formPersonalData.controls;
  }

  ngAfterViewInit(): void {
    // //const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    // const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //   types: ['address']
    // });
    // autocomplete.addListener('place_changed', () => {
    //   this.handleAddressChange();
    // });
  }
  handleAddressChange() {
    const place = this.searchElementRef.nativeElement.value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: place }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const addressObject = this.searchElementRef.nativeElement.value;
        const address = addressObject.split(',')[0]; // Esta línea es para mostrar solo la calle
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

  continue(){
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

    if (this.formPersonalData.valid){
      this.validChanged.emit(true);
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
    } else {
      this.validChanged.emit(false);
      this.toastr.info('Invalid form');
      this.loading=false;
    }
  }
}

