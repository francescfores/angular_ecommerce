import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import { User} from "../../../models/user";
import {Router} from "@angular/router";
import {SharedService} from "../../../services/api/shared.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../services/api/user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  create_user: any;
  users_pg: any;
  public registerForm: UntypedFormGroup;
  submitted = false;
  selectedFile=null;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;
  private loading: boolean;
  private user: User;
  roles: any;
  private errorMessage: string;
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private toastr: ToastrService
  ){
    this.user = new User();
    this.registerForm = this.formBuilder.group({
      name: ['name', Validators.required],
      lastName: ['lastName', Validators.required],
      email: new UntypedFormControl('admin@gmail.com',
        [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      phone: ['phone', Validators.required],
      password: ['123456', Validators.required],
      repeat_password: ['123456', Validators.required],
      address: ['address', Validators.required],
      // firstName: ['', Validators.required],
      rol: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getPaginated(1)
    this.getRoles();
  }

  get f() {
    return this.registerForm.controls;
  }

  getPaginated(page){
    this.userService.paginated(page)
      .subscribe({
        next: res => {
          this.users_pg = res.users_pg;
          this.users_pg.current_page =res.users_pg.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }
  getRoles(){
    this.userService.getAllRoles()
      .subscribe({
        next: res => {
          this.roles = res.data;
          console.log(this.roles)
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }
  paginated(pr) {
    this.users_pg.current_page=this.sharedService.paginated(pr, this.users_pg);
    this.getPaginated(pr)
  }


  create() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    if (this.registerForm.valid){

      if(this.f.password.value !== this.f.repeat_password.value){
        this.errorMessage = 'Passwords do not match!';
        this.toastr.error(this.errorMessage);
      }else {
        this.loading = true;
        this.user.name = this.f.name.value;
        this.user.lastName = this.f.name.value;
        this.user.email = this.f.email.value;
        this.user.password = this.f.password.value;
        this.user.phone = this.f.phone.value;
        this.user.address = this.f.address.value;
        this.user.roles = [this.f.rol.value];

        this.userService.create(this.user)
          .subscribe({
            next: res => {
              this.toastr.info(res.message);
              this.getPaginated(this.users_pg.current_page)
              this.loading=false;
            },
            error: (err: any) => {
              this.loading=false;
              this.toastr.error(err);
            },
            complete: () => { }
          });
      }
    } else {
      this.loading=false;
      this.errorMessage = 'Form invalid!';
      if(this.f.email.errors?.pattern){
        this.errorMessage = 'Email not valid!';
      }
    }
  }

  editAttribute(id) {
    this.router.navigate(
      ['/admin/edit-user'],
      { queryParams: { id } }
    );
  }

  deleteAttribute(id) {
    this.userService.delete(id)
      .subscribe({
        next: res => {
          this.toastr.info(res.message);
          this.getPaginated(this.users_pg.current_pager)
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }

  selectRole($event: Event) {

  }
}
