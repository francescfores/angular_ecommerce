import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../services/api/authentication.service";
import {NgxPayPalModule} from "ngx-paypal";
import {OrderService} from "../../../../services/api/order.service";
import {first} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Client} from "../../../../models/client";
import {ClientService} from "../../../../services/api/client.service";
import {SharedService} from "../../../../services/api/shared.service";
import {AddressService} from "../../../../services/api/address.service";
import {Address} from "../../../../models/address";
import {Variation} from "../../../../models/product";
import {Return} from "../../../../models/return";
import {ReturnDetail} from "../../../../models/returnDetail";

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
  public addressForm: UntypedFormGroup;
  public editAddressForm: UntypedFormGroup;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;
  private loading: boolean;
  submitted=false;
  private order_pg: any;
  create_address: boolean;
  private address: Address;
  edit_address: boolean;
  private create_return: boolean;
  return:Return;
  private return_pg: any;
  private returns: any;
  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private paypal: NgxPayPalModule,
    private orderService: OrderService,
    private sharedService: SharedService,
    private clientService: ClientService,
    private addressService: AddressService,
  ) {
    this.client = new Client();
    this.address = new Address();
    this.return = new Return();
    this.form = this.formBuilder.group({
      nick: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.addressForm = this.formBuilder.group({
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
  get fa() {
    return this.addressForm.controls;
  }
  get fea() {
    return this.editAddressForm.controls;
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
            });
          }
          this.orderService.getReturnByClientPaginated(this.client.id,1)
            .pipe(first())
            .subscribe(
              res => {
                this.returns = res.return_pg.data;
                this.return_pg = res.return_pg;
                this.return_pg.current_page = this.return_pg.current_page+'';
              },
              error => {
              });

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
      // this.client.name = this.fc.name.value;
      // this.client.surnames = this.fc.surnames.value;
      // this.client.dni = this.fc.dni.value;
      // this.client.phone = this.fc.phone.value;
      // this.client.address = this.fc.address.value;
      // this.client.address_detail = this.fc.address_detail.value;
      // this.client.notes = this.fc.notes.value;
      // this.client.country = this.fc.country.value;
      // this.client.city = this.fc.city.value;
      // this.client.province = this.fc.province.value;
      // this.client.zip = this.fc.zip.value;
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

  paginated(pr) {
    this.create_return=null;
    this.order_pg.current_page=this.sharedService.paginated(pr, this.order_pg);
    this.orderService.getOrderByClientPaginated(this.client.id, this.order_pg.current_page)
      .pipe(first())
      .subscribe(
        res => {
          this.orders = res.order_pg.data;
          this.order_pg = res.order_pg;
          this.order_pg.current_page = this.order_pg.current_page + '';
        },
        error => {
        });
  }
  paginatedReturn(pr) {
    this.return_pg.current_page=this.sharedService.paginated(pr, this.return_pg);
    this.orderService.getReturnByClientPaginated(this.client.id, this.return_pg.current_page)
      .pipe(first())
      .subscribe(
        res => {
          this.returns = res.return_pg.data;
          this.return_pg = res.return_pg;
          this.return_pg.current_page = this.return_pg.current_page + '';
          console.log('returrrrrrrrrrn', res)
        },
        error => {
        });
  }

  createAddress() {
    this.submitted = true;
    this.loading=true;
    if (this.addressForm.valid) {
      this.address.name = this.fa.name.value;
      this.address.surnames = this.fa.surnames.value;
      this.address.dni = this.fa.dni.value;
      this.address.phone = this.fa.phone.value;
      this.address.address = this.fa.address.value;
      this.address.address_detail = this.fa.address_detail.value;
      this.address.notes = this.fa.notes.value;
      this.address.country = this.fa.country.value;
      this.address.city = this.fa.city.value;
      this.address.province = this.fa.province.value;
      this.address.zip = this.fa.zip.value;
      this.address.client =this.client.id;

      this.addressService.createByClient(this.address)
        .pipe(first())
        .subscribe(
          res => {
            this.submitted = false;
            this.loading=false;
            console.log(res.data);
            this.create_address=false;
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

  deleteAddress(address) {
    this.addressService.delete(address.id)
      .pipe(first())
      .subscribe(
        res => {
          this.submitted = false;
          this.loading=false;
          console.log(res.data);
          this.getClientById();
        },
        error => {
          this.loading = false;
        });
  }

  openEditAddress(address: any) {
    this.edit_address=true;
    this.editAddressForm = this.formBuilder.group({
      id: [address.id, Validators.required],
      name: [address.name, Validators.required],
      surnames: [address.surnames, [Validators.required]],
      dni: [address.dni, [Validators.required]],
      phone: [address.phone, [Validators.required]],
      address: [address.address, [Validators.required]],
      address_detail: [address.address_detail, [Validators.required]],
      notes: [address.notes, [Validators.required]],
      country: [address.country, [Validators.required]],
      city: [address.city, [Validators.required]],
      province: [address.province, [Validators.required]],
      zip: [address.zip, [Validators.required]],
    });
  }


  editAddress() {
    this.submitted = true;
    this.loading=true;
    if (this.editAddressForm.valid) {
      this.address.id = this.fea.id.value;
      this.address.name = this.fea.name.value;
      this.address.surnames = this.fea.surnames.value;
      this.address.dni = this.fea.dni.value;
      this.address.phone = this.fea.phone.value;
      this.address.address = this.fea.address.value;
      this.address.address_detail = this.fea.address_detail.value;
      this.address.notes = this.fea.notes.value;
      this.address.country = this.fea.country.value;
      this.address.city = this.fea.city.value;
      this.address.province = this.fea.province.value;
      this.address.zip = this.fea.zip.value;

      this.addressService.update(this.address.id, this.address)
        .pipe(first())
        .subscribe(
          res => {
            this.submitted = false;
            this.loading=false;
            console.log(res.data);
            this.getClientById();
            this.edit_address=false;
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

  selectReturn(detail: any) {
    console.log(this.return);
    console.log(this.return.order);
    let order = this.orders.find(x=>x.id ===detail.order_id);
    this.create_return=order.id;

    //step1 comprobar si se ha seleccionada algun producto por primera vez
    // o si el producto seleccionado es de otro pedido
    if(this.return.order===undefined || this.return.order.id!==order.id) {
      console.log('primera vez');
      this.return = new Return();
      this.return.order=this.orders.find(x=>x.id ===detail.order_id);
      this.return.details= [];
      this.return.details.push(detail);
      //si no es la primera vez y es el mismo pedido
    }else{
      //comprobamos si ya existe el producto en la dev si es a si lo borramos sino no
      const detailExist=this.return.details.find(x=>x.id ===detail.id);
      console.log('detailExist',detailExist)
      if(detailExist){
        this.return.details=this.return.details.filter(x=>x.id !==detail.id);
        if(this.return.details.length===0){
          this.return = new Return();
          this.create_return=null;
        }
      }else{
        this.return.details.push(detail);
      }
    }
    //si el producto
    console.log('detail.order',detail);
    console.log(this.return);
  }

  createReturn() {
    this.orderService.createReturn(this.return).pipe(first()).subscribe(
        res => {
          this.submitted = false;
          this.loading=false;
          console.log(res);
          this.orderService.getOrderByClientPaginated(this.client.id,this.order_pg.current_page)
            .pipe(first())
            .subscribe(
              res2 => {
                this.orders = res2.order_pg.data;
                this.order_pg = res2.order_pg;
                this.order_pg.current_page = this.order_pg.current_page+'';
                this.return = new Return();
                },
              error => {
              });
        },
        error => {
          this.loading = false;
        });
  }

  selectQuantityProduct(event, detail) {
    let num = event.target.value;
   this.return.details.find(x=>x.id===detail.id).quantity=num
    console.log(num);
  }
}
