import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AttributeService} from "../../../services/api/attribute.service";
import {Attribute} from "../../../models/attribute";
import {Category} from "../../../models/category";
import {SharedService} from "../../../services/api/shared.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  create_attribute: any;
  attributes_pg: any;
  public registerForm: UntypedFormGroup;
  submitted = false;
  selectedFile=null;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=2000;
  private loading: boolean;
  private attribute: Attribute;
  constructor(
    private router: Router,
    private attributeService: AttributeService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private toastr: ToastrService
  ){
    this.attribute = new Attribute();
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getPaginated(1)
  }

  get f() {
    return this.registerForm.controls;
  }

  getPaginated(page){
    this.attributeService.getPaginated(page)
      .subscribe({
        next: res => {
          this.attributes_pg = res.attributes_pg;
          this.attributes_pg.current_page =res.attributes_pg.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  paginated(pr) {
    this.attributes_pg.current_page=this.sharedService.paginated(pr, this.attributes_pg);
    this.getPaginated(pr)
  }

  create() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    if (this.registerForm.valid){
      this.loading = true;
      this.attribute.name = this.f.name.value;
      this.attribute.value = this.f.value.value;
      this.attribute.desc = this.f.desc.value;
      this.attribute.img = this.selectedFile;

      this.attributeService.createAttribute(this.attribute)
        .subscribe({
          next: res => {
            this.toastr.info(res.message);
            this.getPaginated(this.attributes_pg.current_page)
          },
          error: (err: any) => { },
          complete: () => { }
        });
    } else {
      this.toastr.info('Invalid form');
    }
  }

  editAttribute(id) {
    this.router.navigate(
      ['/admin/edit-attribute'],
      { queryParams: { id } }
    );
  }

  deleteAttribute(id) {
    this.attributeService.deleteAttribute(id)
      .subscribe({
        next: res => {
          this.toastr.info(res.message);
          this.getPaginated(this.attributes_pg.current_pager)
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }
}
