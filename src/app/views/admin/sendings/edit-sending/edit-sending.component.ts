import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {first} from "rxjs/operators";
import {SendingService} from "../../../../services/api/sending.service";
import {Sending} from "../../../../models/sending";

@Component({
  selector: 'app-edit-sending',
  templateUrl: './edit-sending.component.html',
  styleUrls: ['./edit-sending.component.css']
})
export class EditSendingComponent implements OnInit{
  sending:Sending;
  public form: UntypedFormGroup;
  id: number;
  queryObj: any;
  submitted=false;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;
  loaded=false;
  updateSending=false;
  statuses = [];
  status:string;

  constructor(
    private sendingService: SendingService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.sending = new Sending();
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      address_detail: ['', Validators.required],
      notes: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      email: ['', Validators.required],
      carrier_id: ['', Validators.required],
      service: ['', Validators.required],
      carrier: ['', Validators.required],
      rate_id: ['', Validators.required],
      rate: ['', Validators.required],
      delivery_days: ['', Validators.required],
      NewOrderID: ['', Validators.required],
      LabelURL: ['', Validators.required],
      status: ['', Validators.required],
      date: ['', Validators.required],
      ref: ['', Validators.required],
      track_num: ['', Validators.required],
      weight: ['', Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
    });
    this.statuses = [
      { id: 1, key:'pending', name: 'Pendiente' },
      { id: 2, key:'processing', name: 'Procesando' },
      { id: 3, key:'shipped', name: 'Enviado' },
      { id: 4, key:'delivered', name: 'Entregado' },
      { id: 5, key:'returned', name: 'Devuelto' },
      { id: 6, key:'cancelled', name: 'Cancelado' },
    ];
  }


  ngOnInit() {
    this.getParams();
  }
  getParams(){
    this.route.queryParamMap
      .subscribe((params) => {
          this.queryObj = { ...params.keys, ...params };
          this.id =this.queryObj.params.id;
          this.getCategory();
        }
      );
  }
  get fc() {
    return this.form.controls;
  }
  getCategory(){
    this.sendingService.getSendingById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.sending = data.data;
          this.loaded=true;
          this.status=this.sending.status;
          console.log(this.sending)
          if (this.sending) {
            //this.subcategories= this.category.subcategories;
            //init forms
            this.form = this.formBuilder.group({
              name: [this.sending.name, Validators.required],
              surnames: [this.sending.surnames, Validators.required],
              dni: [this.sending.dni, Validators.required],
              phone: [this.sending.phone, Validators.required],
              address: [this.sending.address, Validators.required],
              address_detail: [this.sending.address_detail, Validators.required],
              notes: [this.sending.notes, Validators.required],
              country: [this.sending.country, Validators.required],
              zip: [this.sending.zip, Validators.required],
              city: [this.sending.city, Validators.required],
              province: [this.sending.province, Validators.required],
              email: [this.sending.email, Validators.required],
              carrier_id: [this.sending.carrier_id, Validators.required],
              service: [this.sending.service, Validators.required],
              carrier: [this.sending.carrier, Validators.required],
              rate_id: [this.sending.rate_id, Validators.required],
              rate: [this.sending.rate, Validators.required],
              delivery_days: [this.sending.delivery_days, Validators.required],
              NewOrderID: [this.sending.NewOrderID, Validators.required],
              LabelURL: [this.sending.LabelURL, Validators.required],
              status: [this.sending.status, Validators.required],
              date: [this.sending.date, Validators.required],
              ref: [this.sending.ref, Validators.required],
              track_num: [this.sending.track_num, Validators.required],
              weight: [this.sending.weight, Validators.required],
              length: [this.sending.length, Validators.required],
              width: [this.sending.width, Validators.required],
              height: [this.sending.height, Validators.required],
            });
          }
        },
        error => {
        });
  }

  update() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading=true;
    if (this.form.valid) {
      this.sending.name = this.fc.name.value;
      this.sending.surnames = this.fc.surnames.value;
      this.sending.dni = this.fc.dni.value;
      this.sending.phone = this.fc.phone.value;
      this.sending.address = this.fc.address.value;
      this.sending.address_detail = this.fc.address_detail.value;
      this.sending.notes = this.fc.notes.value;
      this.sending.country = this.fc.country.value;
      this.sending.zip = this.fc.zip.value;
      this.sending.city = this.fc.city.value;
      this.sending.province = this.fc.province.value;
      this.sending.email = this.fc.email.value;
      this.sending.carrier_id = this.fc.carrier_id.value;
      this.sending.service = this.fc.service.value;
      this.sending.carrier = this.fc.carrier.value;
      this.sending.rate_id = this.fc.rate_id.value;
      this.sending.rate = this.fc.rate.value;
      this.sending.delivery_days = this.fc.delivery_days.value;
      this.sending.NewOrderID = this.fc.NewOrderID.value;
      this.sending.LabelURL = this.fc.LabelURL.value;
      this.sending.status = this.fc.status.value;
      this.sending.date = this.fc.date.value;
      this.sending.ref = this.fc.ref.value;
      this.sending.track_num = this.fc.track_num.value;
      this.sending.weight = this.fc.weight.value;
      this.sending.length = this.fc.length.value;
      this.sending.width = this.fc.width.value;
      this.sending.height = this.fc.height.value;

      this.sendingService.updateSending(this.sending.id, this.sending)
        .pipe(first())
        .subscribe(
          res => {
            this.show=true;
            this.text='Atributo actualizado'
            this.color='success'

            this.submitted = false;
            this.loading=false;
            console.log(res.data);
          },
          error => {
            this.loading = false;
          });
    } else {
      this.show=true;
      this.text='error'
      this.color='danger'
      this.loading=false;
    }
  }
  updateStatus($event: any) {
    this.sendingService.updateStatus(this.id,$event.target.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          this.sending = data.data;
          this.status=this.sending.status;
          this.loaded=true;
        },
        error => {
        });
  }

}

