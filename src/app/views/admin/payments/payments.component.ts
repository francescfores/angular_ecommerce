import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SendingService} from "../../../services/api/sending.service";
import {first} from "rxjs/operators";
import {PaymentService} from "../../../services/api/payment.service";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent  implements OnInit {
  clients=null;
  submitted=false;
  private text: string;
  private color: string;
  private show: boolean;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
  ) {
  }

  ngOnInit() {
    this.paymentService.getPaymentsPaginated(1)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.sendings);

          this.clients= data.payments;
          this.clients.current_page =data.payments.current_page+'';

          console.log(data);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }

  editPayment(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-category'],id);
    this.router.navigate(
      ['/admin/edit-payment'],
      { queryParams: { id } }
    );
  }

  deletePayment(id) {
    this.paymentService.deletePayment(id)
      .pipe(first())
      .subscribe(
        res => {
          this.text='Producto eliminado'
          this.color='success'
          this.submitted = false;
          console.log(res);
          this.paginatedProducts(this.clients.current_page)
        },
        error => {
          // this.loading = false;
        });
  }

  paginatedProducts(pr) {
    Number(this.clients.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.clients.current_page)
      if(pr === this.clients.last_page){
        pr = Number(this.clients.current_page)
      }else{
        pr++;
      }
    }
    this.paymentService.getPaymentsPaginated(pr)
      .pipe(first())
      .subscribe(
        data => {
          this.clients = data.payments;
          this.clients.current_page = data.payments.current_page+'';
          console.log(pr);
          console.log(this.clients.current_page);
          console.log(this.clients.current_page===pr);
        },
        error => {
        });
  }


}
