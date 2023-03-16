import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {CarrierService} from "../../../services/api/carrier.service";
import {Carrier} from "../../../models/carrier";
import {Category} from "../../../models/category";

@Component({
  selector: 'app-carriers',
  templateUrl: './carriers.component.html',
  styleUrls: ['./carriers.component.css']
})
export class CarriersComponent implements OnInit {
  create_carrier: any;
  carriers_pg: any;
  public registerForm: UntypedFormGroup;
  submitted = false;
  selectedFile=null;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;
  private loading: boolean;
  private carrier: Carrier;
  constructor(
    private router: Router,
    private carrierService: CarrierService,
    private formBuilder: UntypedFormBuilder,
  ){
    this.carrier = new Carrier();
    this.registerForm = this.formBuilder.group({
      carrier_id: ['', Validators.required],
      service: ['', Validators.required],
      carrier: ['', Validators.required],
      rate_id: ['', Validators.required],
      rate: ['', Validators.required],
      delivery_days: ['', Validators.required],
    });

  }
  ngOnInit() {
    this.getCarriersPaginated(1)
  }
  get f() {
    return this.registerForm.controls;
  }
  getCarriersPaginated(page){
    this.carrierService.getCarriersPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          this.carriers_pg = data.carriers_pg;
          this.carriers_pg.current_page =data.carriers_pg.current_page+'';
        },
        error => {
        });
  }
  paginatedCarriers(pr) {
    Number(this.carriers_pg.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.carriers_pg.current_page)
      if(pr === this.carriers_pg.last_page){
        pr = Number(this.carriers_pg.current_page)
      }else{
        pr++;
      }
    }
    this.getCarriersPaginated(pr)
  }

  create() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    //this.loading = true;
    if (this.registerForm.valid){
      this.loading = true;
      this.carrier.carrier_id = this.f.carrier_id.value;
      this.carrier.service = this.f.service.value;
      this.carrier.carrier = this.f.carrier.value;
      this.carrier.rate_id = this.f.rate_id.value;
      this.carrier.rate = this.f.rate.value;
      this.carrier.delivery_days = this.f.delivery_days.value;
      console.log('valid');

      this.carrierService.createCarrier(this.carrier)
        .pipe(first())
        .subscribe(
          res => {
            this.text='Atributo creado'
            this.color='success'
            this.submitted = false;
            this.loading = false;
            console.log(res.data);
          },
          error => {
            this.loading = false;
          });
    } else {
      console.log('invalid');
      this.show=true;
      this.text='Formulario invalido'
      this.color='danger'
    }
  }
  editCarrier(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-category'],id);
    this.router.navigate(
      ['/admin/edit-carrier'],
      { queryParams: { id } }
    );
  }
  deleteCarrier(id) {
    this.carrierService.deleteCarrier(id)
      .pipe(first())
      .subscribe(
        res => {
          this.getCarriersPaginated(this.carriers_pg.current_pager)
        },
        error => {
          // this.loading = false;
        });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }
}
