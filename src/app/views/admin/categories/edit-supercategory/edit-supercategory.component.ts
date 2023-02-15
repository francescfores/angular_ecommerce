import {Component, OnInit} from '@angular/core';
import {Category} from "../../../../models/category";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {SubCategory} from "../../../../models/subcategory";
import {CategoryService} from "../../../../services/api/category.service";
import {ActivatedRoute, Params} from "@angular/router";
import {first} from "rxjs/operators";
import {SuperCategory} from "../../../../models/supercategory";

@Component({
  selector: 'app-edit-supercategory',
  templateUrl: './edit-supercategory.component.html',
  styleUrls: ['./edit-supercategory.component.css']
})
export class EditSupercategoryComponent implements OnInit {
  id: number;
  queryObj: any;
  private supercategory: SuperCategory;
  public formCategory: UntypedFormGroup;
  public formSubcategory: UntypedFormGroup;
  submitted=false;
  private selectedFile: any;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;
  create_subcategory = false;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.supercategory = new SuperCategory();
    this.formCategory = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', []],
    });
  }
  get fc() {
    return this.formCategory.controls;
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
  getCategory(){
    this.categoryService.getSupercategoryById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.supercategory = data.data;
          console.log(this.supercategory)
          if (this.supercategory) {
            this.formCategory= this.formBuilder.group({
              name: [this.supercategory.name, Validators.required],
              desc: [this.supercategory.desc, Validators.required],
              img: ['', []],
            });
          }
        },
        error => {
        });
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.categoryService.uploadImageSupercat(this.supercategory.id,this.selectedFile)
      .pipe(first())
      .subscribe(
        res => {

          this.text='imagen creado'
          this.color='success'
          this.submitted = false;
          console.log(res);
        },
        error => {
          // this.loading = false;
        });
  }

  updateSuperCategory() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading=true;
    if (this.formCategory.valid) {
      this.supercategory.name = this.fc.name.value;
      this.supercategory.desc = this.fc.desc.value;
      this.supercategory.img = this.selectedFile;

      this.categoryService.updateSupercategory(this.supercategory.id, this.supercategory)
        .pipe(first())
        .subscribe(
          res => {
            this.show=true;
            this.text='Caetgoria actualizada'
            this.color='success'

            this.submitted = false;
            this.loading=false;
            console.log(res.data);
          },
          error => {
            // this.loading = false;
          });
    } else {
      this.show=true;
      this.text='error'
      this.color='danger'
      this.loading=false;
    }
  }

}

