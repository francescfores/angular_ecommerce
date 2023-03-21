import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ClientService} from "../../../services/api/client.service";
import {first} from "rxjs/operators";
import {SendingService} from "../../../services/api/sending.service";
import {UntypedFormGroup} from "@angular/forms";
import {SharedService} from "../../../services/api/shared.service";

@Component({
  selector: 'app-sendings',
  templateUrl: './sendings.component.html',
  styleUrls: ['./sendings.component.css']
})
export class SendingsComponent  implements OnInit {
  sendings=null;
  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;

  constructor(
    private router: Router,
    private sendingService: SendingService,
    private sharedService: SharedService,

  ) {
  }

  ngOnInit() {
    this.getPaginated(1);
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
    this.sendingService.deleteSending(id)
      .pipe(first())
      .subscribe(
        data => {
          this.text='Producto creado'
          this.color='success'
        },
        error => {
        });
  }


  getPaginated(page){
    this.sendingService.getSendingsPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          this.sendings = data.sendings;
          this.sendings.current_page = data.sendings.current_page+'';
        },
        error => {
        });
  }
  paginated(pr) {
    this.sendings.current_page=this.sharedService.paginated(pr, this.sendings);
    this.getPaginated(pr)
  }
}
