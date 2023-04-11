import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {CarrierService} from "../../../services/api/carrier.service";
import {Carrier} from "../../../models/carrier";
import {Category} from "../../../models/category";
import {SharedService} from "../../../services/api/shared.service";
import {ToastrService} from "ngx-toastr";

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
    private sharedService: SharedService,
    private toastr: ToastrService
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
    this.getPaginated(1)
  }
  get f() {
    return this.registerForm.controls;
  }
  getPaginated(page){
    this.carrierService.getCarriersPaginated(page)
      .subscribe({
        next: res => {
          this.carriers_pg = res.carriers_pg;
          this.carriers_pg.current_page =res.carriers_pg.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  paginated(pr) {
    this.carriers_pg.current_page=this.sharedService.paginated(pr, this.carriers_pg);
    this.getPaginated(pr)
  }

  create() {
    this.submitted = true;
    //this.loading = true;
    if (this.registerForm.valid){
      this.loading = true;
      this.carrier.carrier_id = this.f.carrier_id.value;
      this.carrier.service = this.f.service.value;
      this.carrier.carrier = this.f.carrier.value;
      this.carrier.rate_id = this.f.rate_id.value;
      this.carrier.rate = this.f.rate.value;
      this.carrier.delivery_days = this.f.delivery_days.value;

      this.carrierService.createCarrier(this.carrier)
        .subscribe({
          next: res => {
            this.toastr.info(res.message);
            this.carriers_pg = res.carriers_pg;
            this.carriers_pg.current_page =res.carriers_pg.current_page+'';
            this.submitted = false;
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
          },
          complete: () => { }
        });
    } else {
      this.toastr.info('Invalid form');
    }
  }
  editCarrier(id) {
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
          this.getPaginated(this.carriers_pg.current_pager)
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
