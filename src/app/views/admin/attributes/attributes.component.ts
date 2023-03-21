import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AttributeService} from "../../../services/api/attribute.service";
import {Attribute} from "../../../models/attribute";
import {Category} from "../../../models/category";
import {SharedService} from "../../../services/api/shared.service";

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
      .pipe(first())
      .subscribe(
        data => {
          this.attributes_pg = data.attributes_pg;
          this.attributes_pg.current_page =data.attributes_pg.current_page+'';
        },
        error => {
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
        .pipe(first())
        .subscribe(
          res => {
            this.text='Atributo creado'
            this.color='success'
            this.submitted = false;
            this.loading = false;
          },
          error => {
            this.loading = false;
          });
    } else {
      this.show=true;
      this.text='Formulario invalido'
      this.color='danger'
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
      .pipe(first())
      .subscribe(
        res => {
          this.getPaginated(this.attributes_pg.current_pager)
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
