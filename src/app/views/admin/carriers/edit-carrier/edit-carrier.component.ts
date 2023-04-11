import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/api/category.service";
import {ActivatedRoute, Params} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Category} from "../../../../models/category";
import {SubCategory} from "../../../../models/subcategory";
import {CarrierService} from "../../../../services/api/carrier.service";
import {Carrier} from "../../../../models/carrier";
import {first} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-carrier',
  templateUrl: './edit-carrier.component.html',
  styleUrls: ['./edit-carrier.component.css']
})
export class EditCarrierComponent implements OnInit{
  carrier:Carrier;
  public form: UntypedFormGroup;
  id: number;
  queryObj: any;
  submitted=false;
  private selectedFile: any;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;

  constructor(
    private carrierService: CarrierService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.carrier = new Carrier();
    this.form = this.formBuilder.group({
      carrier_id: ['', Validators.required],
      service: ['', Validators.required],
      carrier: ['', Validators.required],
      rate_id: ['', Validators.required],
      rate: ['', Validators.required],
      delivery_days: ['', Validators.required],
    });
  }


  ngOnInit() {
    this.getParams();
  }
  getParams(){
    this.route.queryParamMap
      .subscribe((params) => {
          this.queryObj = { ...params.keys, ...params };
          this.id =this.queryObj.params.id;
          this.get();
        }
      );
  }
  get f() {
    return this.form.controls;
  }
  get(){
    this.carrierService.getCarrierById(this.id)
      .subscribe({
        next: res => {
          this.carrier = res.data;
          this.form= this.formBuilder.group({
            carrier_id: [this.carrier.carrier_id, Validators.required],
            service: [this.carrier.service, Validators.required],
            carrier: [this.carrier.carrier, Validators.required],
            rate_id: [this.carrier.rate_id, Validators.required],
            rate: [this.carrier.rate, Validators.required],
            delivery_days: [this.carrier.delivery_days, Validators.required],
          });
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.carrierService.uploadImage(this.carrier.id,this.selectedFile)
      .subscribe({
        next: res => {
          this.toastr.info(res.message);
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  updateCarrier() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading=true;
    if (this.form.valid) {
      this.carrier.carrier_id = this.f.carrier_id.value;
      this.carrier.service = this.f.service.value;
      this.carrier.carrier = this.f.carrier.value;
      this.carrier.rate_id = this.f.rate_id.value;
      this.carrier.rate = this.f.rate.value;
      this.carrier.delivery_days = this.f.delivery_days.value;

      this.carrierService.updateCarrier(this.carrier.id, this.carrier)
        .subscribe({
          next: res => {
            this.toastr.info(res.message);
          },
          error: (err: any) => {
            this.loading = false;
          },
          complete: () => { }
        });
    } else {
      this.loading=false;
      this.toastr.info('Invalid form');
    }
  }

}
