import {Component, OnInit} from '@angular/core';
import {User} from "../../../../models/user";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../services/api/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{
  user:User;
  public form: UntypedFormGroup;
  id: number;
  queryObj: any;
  submitted=false;
  private selectedFile: any;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;
  private roles: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.user = new User();
    this.form= this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: new UntypedFormControl('',
        [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      phone: ['', Validators.required],
      // password: ['123456', Validators.required],
      // repeat_password: ['123456', Validators.required],
      address: ['', Validators.required],
      rol: ['', Validators.required],
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
    this.userService.get(this.id)
      .subscribe({
        next: res => {
          this.user = res.data;
          this.form= this.formBuilder.group({
            name: [this.user.name, Validators.required],
            lastName: [this.user.lastName, Validators.required],
            email: new UntypedFormControl(this.user.email,
              [Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
            phone: [this.user.phone, Validators.required],
            // password: ['123456', Validators.required],
            // repeat_password: ['123456', Validators.required],
            address: [this.user.address, Validators.required],
            rol: [this.user.roles[0]?.id, Validators.required],
          });
          this.getRoles();

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
  update() {
    this.submitted = true;
    this.loading=true;
    if (this.form.valid) {
      this.user.name = this.f.name.value;
      this.user.lastName = this.f.name.value;
      this.user.email = this.f.email.value;
      // this.user.password = this.f.password.value;
      this.user.phone = this.f.phone.value;
      this.user.address = this.f.address.value;
      this.user.roles = [this.f.rol.value];

      this.userService.update(this.user.id, this.user)
        .subscribe({
          next: res => {
            this.toastr.info(res.message);
            this.submitted = false;
            this.loading=false;
          },
          error: (err: any) => {
            this.loading = false;
            this.toastr.error(err);
          },
          complete: () => { }
        });
    } else {
      this.loading=false;
      this.toastr.error('Invalid form');
    }
  }

  selectRole($event: Event) {

  }
}
