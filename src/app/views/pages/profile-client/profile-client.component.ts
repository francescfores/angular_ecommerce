import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {NgxPayPalModule} from "ngx-paypal";
import {OrderService} from "../../../services/api/order.service";
import {Cart} from "../../../models/cart";
import {first} from "rxjs/operators";
import {AttributeService} from "../../../services/api/attribute.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Attribute} from "../../../models/attribute";
import {Client} from "../../../models/client";
import {ClientService} from "../../../services/api/client.service";

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit {
  openTab = 1;
  private client: any;
  orders: any;
  showOrder: any;
  public form: UntypedFormGroup;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;
  private loading: boolean;
  submitted=false;
  private order_pg: any;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private orderService: OrderService,
    private clientService: ClientService,
  ) {
    this.client = new Client();
    this.form = this.formBuilder.group({
      nick: ['', Validators.required],
      email: ['', Validators.required],
      name: ['', Validators.required],
      surnames: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address_detail: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      zip: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.client =this.authenticationService.currentClientValue;
    //this.getOrders();
    this.getClientById();

  }
  get fc() {
    return this.form.controls;
  }
  getClientById(){
    this.clientService.getClientById(this.client.id)
      .pipe(first())
      .subscribe(
        data => {
          this.client = data.data;
          console.log(data)
          if (this.client) {
            this.form= this.formBuilder.group({
              nick: [this.client.nick, Validators.required],
              email: [this.client.email, Validators.required],
              name: [this.client.name, Validators.required],
              surnames: [this.client.surnames, Validators.required],
              dni: [this.client.dni, Validators.required],
              phone: [this.client.phone, Validators.required],
              address: [this.client.address, Validators.required],
              address_detail: [this.client.address_detail, Validators.required],
              notes: [this.client.notes, Validators.required],
              country: [this.client.country, Validators.required],
              city: [this.client.city, Validators.required],
              province: [this.client.province, Validators.required],
              zip: [this.client.zip, Validators.required],
            });
          }

          this.orderService.getOrderByClientPaginated(this.client.id,1)
            .pipe(first())
            .subscribe(
              res => {
                this.orders = res.order_pg.data;
                this.order_pg = res.order_pg;
                this.order_pg.current_page = this.order_pg.current_page+'';
              },
              error => {
              });
        },
        error => {
        });
  }

  toggleTabs($tabNumber: number){
    this.openTab = $tabNumber;
  }
  getOrders(){
    this.orderService.getOrderByClient(this.client.id)
      .pipe(first())
      .subscribe(
        res => {
          console.log(res)
          this.orders= res.data;
          this.orders.details= res.data.details;
          console.log(this.orders[0].details);

//          this.router.navigate(['/shop/products']);
        },
        error => {
          // this.loading = false;
        });
  }

  showOrderSelected(order) {
    this.showOrder===order.id ? this.showOrder = null:this.showOrder = order.id;
    //this.showOrder=order.id;
    console.log(order.details[0].variation)
  }

  udpate() {
    this.submitted = true;
    this.loading=true;
    if (this.form.valid) {
      this.client.nick = this.fc.nick.value;
      this.client.email = this.fc.email.value;
      this.client.name = this.fc.name.value;
      this.client.surnames = this.fc.surnames.value;
      this.client.dni = this.fc.dni.value;
      this.client.phone = this.fc.phone.value;
      this.client.address = this.fc.address.value;
      this.client.address_detail = this.fc.address_detail.value;
      this.client.notes = this.fc.notes.value;
      this.client.country = this.fc.country.value;
      this.client.city = this.fc.city.value;
      this.client.province = this.fc.province.value;
      this.client.zip = this.fc.zip.value;
      this.clientService.updateClient(this.client.id, this.client)
        .pipe(first())
        .subscribe(
          res => {
            this.client=res.data;
            this.show=true;
            this.text=res.message;
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

  paginatedOrders(pr) {
    Number(this.order_pg.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.order_pg.current_page)
      if(pr === this.order_pg.last_page){
        pr = Number(this.order_pg.current_page)
      }else{
        pr++;
      }
    }
    this.order_pg.current_page=pr;

    this.orderService.getOrderByClientPaginated(this.client.id,this.order_pg.current_page)
      .pipe(first())
      .subscribe(
        res => {
          this.orders = res.order_pg.data;
          this.order_pg = res.order_pg;
          this.order_pg.current_page = this.order_pg.current_page+'';
        },
        error => {
        });

  }

}
