import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ClientService} from "../../../services/api/client.service";
import {first} from "rxjs/operators";
import {SendingService} from "../../../services/api/sending.service";
import {UntypedFormGroup} from "@angular/forms";

@Component({
  selector: 'app-sendings',
  templateUrl: './sendings.component.html',
  styleUrls: ['./sendings.component.css']
})
export class SendingsComponent  implements OnInit {
  clients=null;
  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;

  constructor(
    private router: Router,
    private clientService: SendingService,
  ) {
  }

  ngOnInit() {
    this.clientService.getSendingsPaginated(1)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.sendings);

          this.clients= data.sendings;
          this.clients.current_page =data.sendings.current_page+'';

          console.log(data);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }

  editProduct(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-product'],id);
    this.router.navigate(
      ['/admin/edit-sendings'],
      { queryParams: { id } }
    );
  }

  deleteProduct(id) {
    this.clientService.deleteSending(id)
      .pipe(first())
      .subscribe(
        data => {
          this.text='Producto creado'
          this.color='success'
        },
        error => {
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
    this.clientService.getSendingsPaginated(pr)
      .pipe(first())
      .subscribe(
        data => {
          this.clients = data.sendings;
          this.clients.current_page = data.sendings.current_page+'';
          console.log(pr);
          console.log(this.clients.current_page);
          console.log(this.clients.current_page===pr);
        },
        error => {
        });
  }
}
