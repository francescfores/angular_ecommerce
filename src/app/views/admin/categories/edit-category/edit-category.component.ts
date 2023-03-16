import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../../services/api/product.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Product} from "../../../../models/product";
import {Category} from "../../../../models/category";
import {SubCategory} from "../../../../models/subcategory";
import {SuperCategory} from "../../../../models/supercategory";
import {first} from "rxjs/operators";
import {CategoryService} from "../../../../services/api/category.service";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  id: number;
  queryObj: any;
  private category: Category;
  public formCategory: UntypedFormGroup;
  public formSubcategory: UntypedFormGroup;
  submitted=false;
  private selectedFile: any;
  private selectedFileSubcat: any;
  private text: string;
  private color: string;
  private show: boolean;
  loading = false;
  private category_id: any;
  private subcategories: any;
  create_subcategory = false;
  private subcategory: SubCategory;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.category = new Category();
    this.subcategory = new SubCategory();
    this.formCategory = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', []],
    });
    this.formSubcategory = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', Validators.required],
    });
  }
  get fc() {
    return this.formCategory.controls;
  }
  get fsc() {
    return this.formSubcategory.controls;
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
    this.categoryService.getCategoryById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.category = data.data;
          console.log(this.category)
          if (this.category) {
            //this.subcategories= this.category.subcategories;
            //init forms
            this.formCategory= this.formBuilder.group({
              name: [this.category.name, Validators.required],
              desc: [this.category.desc, Validators.required],
              img: ['', []],
            });

            this.getSubCategorysByCategoryPaginated(1,this.id)
          }
        },
        error => {
        });
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.categoryService.uploadImage(this.category.id,this.selectedFile)
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
    this.selectedFileSubcat = event.target.files[0];
  }

  updateCategory() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading=true;
    if (this.formCategory.valid) {
      this.category.name = this.fc.name.value;
      this.category.desc = this.fc.desc.value;
      this.category.img = this.selectedFile;

      this.categoryService.updateCategory(this.category.id, this.category)
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

  getSubCategorysByCategoryPaginated(page, id){
    this.category_id =id;
    this.categoryService.getSubCategorysByCategoryPaginated(page, id)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.categories);

          this.subcategories= data.subcategories;
          this.subcategories.current_page =data.subcategories.current_page+'';

          console.log(data);
        },
        error => {
          // this.loading = false;
        });
  }

  createSubcategory() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    this.loading = true;
    if (this.formSubcategory.valid){
      this.loading = true;
      this.subcategory.name = this.fsc.name.value;
      this.subcategory.desc = this.fsc.desc.value;
      this.subcategory.img = this.selectedFileSubcat;
      console.log('valid');

      this.categoryService.createSubcategory(this.subcategory,this.category.id)
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

  paginatedSubCategorys(pr) {
    Number(this.subcategories.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.subcategories.current_page)
      if(pr === this.subcategories.last_page){
        pr = Number(this.subcategories.current_page)
      }else{
        pr++;
      }
    }
      this.getSubCategorysByCategoryPaginated(pr, this.category_id);
  }

  editSubcategory(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-category'],id);
    this.router.navigate(
      ['/admin/edit-subcategory'],
      { queryParams: { id } }
    );
  }

  deleteSubcategory(id) {

  }
}
