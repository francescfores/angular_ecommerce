import {Component, OnInit} from '@angular/core';
import {Category} from "../../../../models/category";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {SubCategory} from "../../../../models/subcategory";
import {CategoryService} from "../../../../services/api/category.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {SuperCategory} from "../../../../models/supercategory";

@Component({
  selector: 'app-edit-subcategory',
  templateUrl: './edit-subcategory.component.html',
  styleUrls: ['./edit-subcategory.component.css']
})
export class EditSubcategoryComponent implements OnInit{
  id: number;
  queryObj: any;
  public formSubcategory: UntypedFormGroup;
  public formSupercategory: UntypedFormGroup;

  private subcategory: SubCategory;
  private supercategory: SuperCategory;

  private supercategories: any;
  create_supercategory = false;
  private subcategory_id: any;

  submitted=false;
  private selectedFile: any;
  private selectedFileSupercat: any;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;


  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.subcategory = new SubCategory();
    this.supercategory = new SuperCategory();

    this.formSubcategory = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', []],
    });
    this.formSupercategory = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', Validators.required],
    });
  }
  get fc() {
    return this.formSubcategory.controls;
  }
  get fsc() {
    return this.formSupercategory.controls;
  }

  ngOnInit() {
    this.getParams();
  }
  getParams(){
    this.route.queryParamMap
      .subscribe((params) => {
          this.queryObj = { ...params.keys, ...params };
          this.id =this.queryObj.params.id;
          this.getSubcategory();
        }
      );
  }
  getSubcategory(){
    this.categoryService.getSubcategoryById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.subcategory = data.data;
          console.log(this.subcategory)
          if (this.subcategory) {
            //this.subcategories= this.category.subcategories;
            //init forms
            this.formSubcategory= this.formBuilder.group({
              name: [this.subcategory.name, Validators.required],
              desc: [this.subcategory.desc, Validators.required],
              img: ['', []],
            });

            this.getSuperCategorysBySubCategoryPaginated(1,this.id)
          }
        },
        error => {
        });
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.categoryService.uploadImageSubcat(this.subcategory.id,this.selectedFile)
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
  onFileChangedSubcat(event) {
    this.selectedFileSupercat = event.target.files[0];
  }
  updateSubcategory() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading=true;
    if (this.formSubcategory.valid) {
      this.subcategory.name = this.fc.name.value;
      this.subcategory.desc = this.fc.desc.value;
      this.subcategory.img = this.selectedFile;

      this.categoryService.updateSubcategory(this.subcategory.id, this.subcategory)
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

  getSuperCategorysBySubCategoryPaginated(page, id){
    this.subcategory_id =id;
    this.categoryService.getSuperCategorysBySubCategoryPaginated(page, id)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.categories);

          this.supercategories= data.supercategories;
          this.supercategories.current_page =data.supercategories.current_page+'';
          console.log(data);
        },
        error => {
          // this.loading = false;
        });
  }

  createSupercategory() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading = true;
    if (this.formSupercategory.valid){
      this.loading = true;
      this.supercategory.name = this.fsc.name.value;
      this.supercategory.desc = this.fsc.desc.value;
      this.supercategory.img = this.selectedFileSupercat;
      console.log('valid');
      console.log(this.subcategory.id);

      this.categoryService.createSupercategory(this.supercategory,this.subcategory.id)
        .pipe(first())
        .subscribe(
          res => {
            //this.categories = res.data.category;

            this.text='Producto creado'
            this.color='success'
            this.submitted = false;
            this.loading = false;

            console.log(res.data);
          },
          error => {
            this.loading = false;
            this.submitted = false;
          });
    } else {
      console.log('invalid');
      this.show=true;
      this.text='Formulario invalido'
      this.color='danger'
      this.loading = false;

    }
  }

  paginatedSuperCategoriess(pr) {
    Number(this.supercategories.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.supercategories.current_page)
      if(pr === this.supercategories.last_page){
        pr = Number(this.supercategories.current_page)
      }else{
        pr++;
      }
    }
    this.getSuperCategorysBySubCategoryPaginated(pr, this.subcategory_id);
  }

  editSupercategory(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-category'],id);
    this.router.navigate(
      ['/admin/edit-supercategory'],
      { queryParams: { id } }
    );
  }
}
