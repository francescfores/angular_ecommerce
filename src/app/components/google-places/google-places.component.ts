import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-google-places',
  templateUrl: './google-places.component.html',
  styleUrls: ['./google-places.component.css']
})
export class GooglePlacesComponent implements OnInit, AfterViewInit {
  formPersonalData: FormGroup;
  submitted = false;

  @ViewChild('search') public searchElementRef: ElementRef;

  constructor(
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
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

    //this.initConfig();
  }

  get fpd() {
    return this.formPersonalData.controls;
  }

  ngAfterViewInit(): void {
    //const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ['address']
    });
    autocomplete.addListener('place_changed', () => {
      this.handleAddressChange();
    });
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
}

