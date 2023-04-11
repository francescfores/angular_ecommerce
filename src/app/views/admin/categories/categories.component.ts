import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CategoryService} from "../../../services/api/category.service";
import {first} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Category} from "../../../models/category";
import {SharedService} from "../../../services/api/shared.service";
import {ToastrService} from "ngx-toastr";

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
  autocloseTime=2000;
  private category: Category;
  private selectedFile: any;
  loading=false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private toastr: ToastrService
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

  editCategory(id) {
    this.router.navigate(
      ['/admin/edit-category'],
      { queryParams: { id } }
    );
  }
  deleteCategory(id) {
    this.categoryService.deleteCategory(id)
      .subscribe({
        next: res => {
          this.toastr.info(res.message);
          this.submitted = false;
          this.paginatedCategories(this.categories.current_page)
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  getCategorysPaginated(page){
    this.categoryService.getCategorysPaginated(page)
      .subscribe({
        next: res => {
          this.categories= res.categories;
          this.categories.current_page =res.categories.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }
  getSubCategorysPaginated(page){
    this.categoryService.getSubCategorysPaginated(page)
      .subscribe({
        next: res => {
          this.subcategories= res.subcategories;
          this.subcategories.current_page =res.subcategories.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }
  getSuperCategorysPaginated(page){
    this.categoryService.getSuperCategorysPaginated(page)
      .subscribe({
        next: res => {
          this.supercategories= res.supercategories;
          this.supercategories.current_page =res.supercategories.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  getSubCategorysByCategoryPaginated(page, id){
    this.category_id =id;
    this.categoryService.getSubCategorysByCategoryPaginated(page, id)
      .subscribe({
        next: res => {
          this.subcategories= res.subcategories;
          this.subcategories.current_page =res.subcategories.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }
  getSuperCategorysBySubCategoryPaginated(page, id){
    this.subcategory_id =id;
    this.categoryService.getSuperCategorysBySubCategoryPaginated(page, id)
      .subscribe({
        next: res => {
          this.supercategories= res.supercategories;
          this.supercategories.current_page =res.supercategories.current_page+'';
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  paginatedCategories(pr) {
    this.categories.current_page=this.sharedService.paginated(pr, this.categories);
    this.getCategorysPaginated(pr)
  }
  paginatedSubCategorys(pr) {
    this.categories.current_page=this.sharedService.paginated(pr, this.subcategories);
    if(this.category_id){
      this.getSubCategorysByCategoryPaginated(pr, this.category_id);
    }else{
      this.getSubCategorysPaginated(pr);
    }
  }
  paginatedSuperCategorys(pr) {
    this.categories.current_page=this.sharedService.paginated(pr, this.supercategories);

    if(this.subcategory_id){
      this.getSuperCategorysBySubCategoryPaginated(pr, this.subcategory_id);
    }else{
      this.getSuperCategorysPaginated(pr);
    }
  }

  createCategory() {
    this.submitted = true;
      if (this.formCategory.valid){
        this.loading = true;
        this.category.name = this.fc.name.value;
        this.category.desc = this.fc.desc.value;
        this.category.img = this.selectedFile;

        this.categoryService.createCategory(this.category)
          .subscribe({
            next: res => {
              this.toastr.info(res.message);
              this.submitted = false;
              this.loading = false;
              this.paginatedCategories(this.categories.current_page)
            },
            error: (err: any) => {
              this.loading = false;
            },
            complete: () => { }
          });
      } else {
        this.loading = false;
        this.toastr.info('Invalid form');
      }
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  editSubcategory(id) {
    this.router.navigate(
      ['/admin/edit-subcategory'],
      { queryParams: { id } }
    );
  }
  editSupercategory(id) {
    this.router.navigate(
      ['/admin/edit-supercategory'],
      { queryParams: { id } }
    );
  }
  deleteSubcategory(id) {}
  deleteSupercategory(id) {}
}
