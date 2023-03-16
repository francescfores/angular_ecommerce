import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../../services/api/category.service";
import {ActivatedRoute, Params} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Category} from "../../../../models/category";
import {SubCategory} from "../../../../models/subcategory";
import {AttributeService} from "../../../../services/api/attribute.service";
import {Attribute} from "../../../../models/attribute";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.css']
})
export class EditAttributeComponent implements OnInit{
  attribute:Attribute;
  public form: UntypedFormGroup;
  id: number;
  queryObj: any;
  submitted=false;
  private selectedFile: any;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;

  constructor(
    private attributeService: AttributeService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.attribute = new Attribute();
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', []],
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
          this.getCategory();
        }
      );
  }
  get fc() {
    return this.form.controls;
  }
  getCategory(){
    this.attributeService.getAttributeById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.attribute = data.data;
          console.log(this.attribute)
          if (this.attribute) {
            //this.subcategories= this.category.subcategories;
            //init forms
            this.form= this.formBuilder.group({
              name: [this.attribute.name, Validators.required],
              value: [this.attribute.value, Validators.required],
              desc: [this.attribute.desc, Validators.required],
              img: ['', []],
            });
          }
        },
        error => {
        });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.attributeService.uploadImage(this.attribute.id,this.selectedFile)
      .pipe(first())
      .subscribe(
        res => {
          this.text='imagen creado'
          this.color='success'
          this.submitted = false;
        },
        error => {
          // this.loading = false;
        });
  }

  updateAttribute() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading=true;
    if (this.form.valid) {
      this.attribute.name = this.fc.name.value;
      this.attribute.value = this.fc.value.value;
      this.attribute.desc = this.fc.desc.value;
      this.attribute.img = this.selectedFile;

      this.attributeService.updateAttribute(this.attribute.id, this.attribute)
        .pipe(first())
        .subscribe(
          res => {
            this.show=true;
            this.text='Atributo actualizado'
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

}
