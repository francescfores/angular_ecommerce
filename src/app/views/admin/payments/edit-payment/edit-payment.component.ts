import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {PaymentService} from "../../../../services/api/payment.service";
import {ActivatedRoute, Params} from "@angular/router";
import {first} from "rxjs/operators";
import {Payment} from "../../../../models/payment";

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit{
  payment:Payment;
  public form: UntypedFormGroup;
  id: number;
  queryObj: any;
  submitted=false;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;
  loaded=false;
  updatePayment=false;
  statuses = [
    { id: 1, key:'pending', name: 'Pendiente' },
    { id: 2, key:'processing', name: 'Procesando' },
    { id: 3, key:'succeeded', name: 'Completado' },
    { id: 4, key:'refunded', name: 'Reembolsado' },
    { id: 5, key:'failed', name: 'Rechazado' },
    { id: 6, key:'canceled', name: 'Fallido' },
    { id: 7, key:'awaiting', name: 'En espera' },
    { id: 8, key:'requires_action', name: 'Anulado' },
  ];
  status:string;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.payment = new Payment();
    this.form = this.formBuilder.group({
      stripe_payment_id: ['', Validators.required],
      amount: ['', Validators.required],
      currency: ['', Validators.required],
      status: ['', Validators.required],
      payment_method: ['', Validators.required],
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
          this.getCategory();
        }
      );
  }
  get fc() {
    return this.form.controls;
  }
  getCategory(){
    this.paymentService.getPaymentById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.payment = data.data;
          this.status=this.payment.status;

          console.log(this.payment)
          if (this.payment) {
            //this.subcategories= this.category.subcategories;
            //init forms
            this.form = this.formBuilder.group({
              stripe_payment_id: [this.payment.stripe_payment_id, Validators.required],
              amount: [this.payment.amount, Validators.required],
              currency: [this.payment.currency, Validators.required],
              status: [this.payment.status, Validators.required],
              payment_method: [this.payment.payment_method, Validators.required],
            });
          }
          this.loaded=true;

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
      this.payment.stripe_payment_id = this.fc.stripe_payment_id.value;
      this.payment.amount = this.fc.amount.value;
      this.payment.currency = this.fc.currency.value;
      this.payment.status = this.fc.status.value;
      this.payment.payment_method = this.fc.payment_method.value;

      this.paymentService.updatePayment(this.payment.id, this.payment)
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
    this.paymentService.updateStatus(this.id,$event.target.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          this.payment = data.data;
          this.status=this.payment.status;
          this.loaded=true;
        },
        error => {
        });
  }

}

