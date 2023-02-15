import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CategoryService} from "../../../services/api/category.service";
import {first} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Category} from "../../../models/category";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{
  categories=null;
  subcategories=null;
  supercategories=null;
  private category_id: any;
  private subcategory_id: any;
  create_category = false;
  public formCategory: UntypedFormGroup;
  submitted = false;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=20000;
  private category: Category;
  private selectedFile: any;
  loading=false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.formCategory = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      img: ['', Validators.required],
    });
    this.category = new Category();
  }

  get fc() {
    return this.formCategory.controls;
  }

  ngOnInit() {
    this.getCategorysPaginated(1);
    this.getSubCategorysPaginated(1);
    this.getSuperCategorysPaginated(1);
  }

  getCategorysPaginated(page){
    this.categoryService.getCategorysPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.categories);

          this.categories= data.categories;
          this.categories.current_page =data.categories.current_page+'';

          console.log(data);
        },
        error => {
          // this.loading = false;
        });
  }
  getSubCategorysPaginated(page){
    this.categoryService.getSubCategorysPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.subcategories);

          this.subcategories= data.subcategories;
          this.subcategories.current_page =data.subcategories.current_page+'';

          console.log(data);
        },
        error => {
          // this.loading = false;
        });
  }
  getSuperCategorysPaginated(page){
    this.categoryService.getSuperCategorysPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          console.log(data.supercategories);
          console.log(data.supercategories.data);

          this.supercategories= data.supercategories;
          this.supercategories.current_page =data.supercategories.current_page+'';

          console.log(data);
        },
        error => {
          // this.loading = false;
        });
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
  getSuperCategorysBySubCategoryPaginated(page, id){
    this.subcategory_id =id;
    this.categoryService.getSuperCategorysBySubCategoryPaginated(page, id)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);

          this.supercategories= data.supercategories;
          this.supercategories.current_page =data.supercategories.current_page+'';

          console.log(data);
        },
        error => {
          // this.loading = false;
        });
  }

  editCategory(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-category'],id);
    this.router.navigate(
      ['/admin/edit-category'],
      { queryParams: { id } }
    );
  }
  deleteCategory(id) {
    this.categoryService.deleteCategory(id)
      .pipe(first())
      .subscribe(
        res => {
          this.text='Producto eliminado'
          this.color='success'
          this.submitted = false;
          console.log(res);
          this.paginatedProducts(this.categories.current_page)
        },
        error => {
          // this.loading = false;
        });
  }
  paginatedProducts(pr) {
    Number(this.categories.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.categories.current_page)
      if(pr === this.categories.last_page){
        pr = Number(this.categories.current_page)
      }else{
        pr++;
      }
    }
    this.getCategorysPaginated(pr);
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
    if(this.category_id){
      this.getSubCategorysByCategoryPaginated(pr, this.category_id);
    }else{
      this.getSubCategorysPaginated(pr);
    }
  }
  paginatedSuperCategorys(pr) {
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
    if(this.subcategory_id){
      this.getSuperCategorysBySubCategoryPaginated(pr, this.subcategory_id);
    }else{
      this.getSuperCategorysPaginated(pr);
    }
  }

  createCategory() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    //this.loading = true;
      if (this.formCategory.valid){
        this.loading = true;
        this.category.name = this.fc.name.value;
        this.category.desc = this.fc.desc.value;
        this.category.img = this.selectedFile;
        console.log('valid');

        this.categoryService.createCategory(this.category)
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
              // this.loading = false;
            });
      } else {
        console.log('invalid');

        this.show=true;
        this.text='Formulario invalido'
        this.color='danger'
      }
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
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

  editSupercategory(id) {
    console.log(id)
    this.router.navigate(
      ['/admin/edit-supercategory'],
      { queryParams: { id } }
    );
  }
}
