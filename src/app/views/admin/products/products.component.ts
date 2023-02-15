import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {Cart} from "../../../models/cart";
import {first, toArray} from "rxjs/operators";
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Category} from "../../../models/category";
import {$e} from "codelyzer/angular/styles/chars";
import {SubCategory} from "../../../models/subcategory";
import {SuperCategory} from "../../../models/supercategory";
import {Product} from "../../../models/product";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categories: Category[]= [];
  subcategories: SubCategory[] = [];
  supercategories: SuperCategory[]= [];

  category: Category;
  subcategory: SubCategory;
  supercategory: SuperCategory;

  private products: string;
  colors: any;
  private sizes: any;

  variations = [];
  attributes:any;
  attributes_type:any;
  expandedDivId: string;
  type= 1;
  public attributesArray: any[] = [];
  seleccionado: any;
  private variationsSelected=[];
  private attributes_group: any;
  selectedOption= null;
  selectedOptions: any = {};
  selectedCategory=null;
  selectedSubCategory=null;
  selectedSuperCategory=null;

  selectedFile=null;

  //form
  submitted = false;
  public registerForm: UntypedFormGroup;
  loading = false;
  product:any;
  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=20000;
  private product_pg: any;


  public variationsForm: FormGroup[]=[];
  selectedFileVariations=[];

  constructor(
    private router: Router,
    private productService: ProductService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.product = new Product();
    this.category = new Category();
    this.category = new Category();
    this.subcategory = new SubCategory();
    this.supercategory = new SuperCategory();
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      img: ['', Validators.required],
      category: [null ],
      subcategory: [null ],
      supercategory: [null ],
    });
  }

  ngOnInit() {
    this.productService.getProducts()
      .pipe(first())
      .subscribe(
        data => {
          this.categories = data.data.category;
          this.products = data.data.product;
          this.product_pg = data.data.product_pg;
          this.product_pg.current_page =data.data.product_pg.current_page+'';
          this.colors = data.data.color;
          this.sizes = data.data.size;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
    this.productService.getAttributes()
      .pipe(first())
      .subscribe(
        res => {
          this.attributes = res.data.attributes;
          this.attributes_group = res.data.attributes_group;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
    this.productService.getCategories()
      .pipe(first())
      .subscribe(
        res => {
          this.categories = res.data.category;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }

  get f() {
    return this.registerForm.controls;
  }
  fv(i) {
    return this.variationsForm[i].controls;
  }
  toggleExpansion(divId) {
    this.expandedDivId = this.expandedDivId === divId ? '' : divId;
  }
  productType(test) {
    this.type = Number(test.target.value);
    for (const key of Object.keys(this.attributes_group)) {
      this.selectedOptions[key] = null;
    }


  }
  selectVariation(seleccionado: any) {
    const attribute = this.attributes.find(x => x.id === Number(seleccionado));
    const name = this.variationsSelected.find(x => x.name === attribute.name);
    if(name){
      this.variationsSelected = this.variationsSelected.filter(x => x.name !== attribute.name);
      this.variationsSelected.push(attribute);
    }else{
      this.variationsSelected.push(attribute);
    }
    this.variationsSelected.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    console.log('attribute');
    console.log(attribute);
    console.log(this.variationsSelected);
  }
  createVariation() {
    if(this.variationsSelected.length > 0){
      let exists = false;
      for (let variation of this.variations) {
        if (variation.attributes.length === this.variationsSelected.length) {
          exists = variation.attributes.every((value, index) => value === this.variationsSelected[index]);
          if (exists) {
            break;
          }
        }
      }
      if (exists) {
      } else {
        this.variations.push({
          id:this.variations.length,
          price:this.f.price.value,
          stock:this.f.stock.value,
          img:this.selectedFile,
          attributes:this.variationsSelected
        });
        this.variationsForm.push(
          this.formBuilder.group({
            price: [this.f.price.value, Validators.required],
            stock: [this.f.stock.value, Validators.required],
            img: [this.f.img.value, Validators.required],
          })
        ) ;
      }
      this.selectedFileVariations[this.variations.length]=this.selectedFile;
    }
    this.variationsSelected=[];
    for (const key of Object.keys(this.selectedOptions)) {
      this.selectedOptions[key] = null;
    }
    console.log(this.variations);
  }
  createAllVariation() {
    // Recorrer el objeto
    let attributesGroup=this.attributes_group;
    let variation = [];
    // Recorrer el objeto
    for (let group in attributesGroup) {
      let attrGroup = attributesGroup[group];
      // Bucle anidado para recorrer cada atributo
      attrGroup.forEach(attr => {
        let variationObj = {};
        variationObj[group] = attr;
        // Bucle anidado para recorrer los demas atributos
        for (let group2 in attributesGroup) {
          if (group2 !== group) {
            let attrGroup2 = attributesGroup[group2];
            this.variations.push(attrGroup2);
          }
        }
      });
    }
  }

  passBack() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    //this.loading = true;
    if (this.type===1){
      if (this.registerForm.valid){
      this.product.name = this.f.name.value;
      this.product.desc = this.f.desc.value;
      this.product.price = this.f.price.value;
      this.product.stock = this.f.stock.value;
      this.product.img = this.selectedFile;
      this.product.category = this.category.id;
      this.product.subcategory = this.subcategory.id;
      this.product.supercategory = this.supercategory.id;

      this.productService.createProduct(this.product)
        .pipe(first())
        .subscribe(
          res => {
            //this.categories = res.data.category;

            this.text='Producto creado'
            this.color='success'
            this.submitted = false;
            console.log(res.data);
          },
          error => {
            // this.loading = false;
          });
    } else {
        this.show=true;
        this.text='error'
        this.color='success'
      }
  }else if (this.type===2){
      if (this.registerForm.valid) {

        Object.entries(this.variationsForm).forEach(([key, value], index) => {
          if(value.valid){
            this.show=true;
            this.text='success'
            this.color='success'
          }else{
            this.show=true;
            this.text='error'
            this.color='danger'
          }

        });

      this.product.name = this.f.name.value;
      this.product.desc = this.f.desc.value;
      this.product.price = this.f.price.value;
      this.product.stock = this.f.stock.value;
      this.product.img = this.selectedFile;
      this.product.category = this.category.id;
      this.product.subcategory = this.subcategory.id;
      this.product.supercategory = this.supercategory.id;

      this.product.variations = this.variations;
      this.productService.addProduct2(this.product)
        .pipe(first())
        .subscribe(
          res => {

            this.text='Producto creado'
            this.color='success'
            this.submitted = false;
            console.log(res);
          },
          error => {
            // this.loading = false;
          });
    }else {
        this.show=true;
        this.text='error'
        this.color='danger'
      }
    }
  }
  selectCategory($event: any) {
    this.category = this.categories.find(x=>x.id===Number($event.target.value));
    if (this.category !== undefined) {
      this.subcategories= this.category.subcategories;
    }
  }
  selectSubCategory($event: any) {
    this.subcategory = this.subcategories.find(x=>x.id===Number($event.target.value));
    if (this.subcategory !== undefined) {
      this.supercategories= this.subcategory.supercategories;
    }
  }

  selectSuperCategory($event: any) {
    this.supercategory = this.supercategories.find(x=>x.id===Number($event.target.value));
  }

  paginatedProducts(pr) {
    Number(this.product_pg.current_page)
    if(pr==='Previous'){
      pr--;
    }else if(pr==='Next'){
      pr = Number(this.product_pg.current_page)
      if(pr === this.product_pg.last_page){
        pr = Number(this.product_pg.current_page)
      }else{
        pr++;
      }
    }
    this.productService.getProductsPaginated(pr)
      .pipe(first())
      .subscribe(
        data => {
          this.product_pg = data.data.product_pg;
          this.product_pg.current_page = data.data.product_pg.current_page+'';
          console.log(pr);
          console.log(this.product_pg.current_page);
          console.log(this.product_pg.current_page===pr);
        },
        error => {
        });
  }

  editProduct(id) {
    console.log(id)
    //this.router.navigate(['/admin/edit-product'],id);
    this.router.navigate(
      ['/admin/edit-product'],
      { queryParams: { id } }
    );
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }
  onFileChangedVariation(event,id) {
    this.selectedFileVariations[id] = event.target.files[0];
    this.variations[id].img = event.target.files[0];
    console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    console.log(event.target.files[0]);
    console.log(this.selectedFileVariations[id]);
    console.log(this.selectedFileVariations[id].name);
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }

  saveVariation(variation: any) {
    console.log('saveVariation');
    console.log('saveVariation');
    console.log(this.fv(variation.id).stock.value);
    this.variations.find(x=>x.id ===variation.id).price=this.fv(variation.id).price.value;
    this.variations.find(x=>x.id ===variation.id).stock=this.fv(variation.id).stock.value;
    this.product.variations=this.variations;
    console.log(this.product.variations);
    Object.entries(this.variationsForm).forEach(([key, value], index) => {
      if(value.valid){
        this.show=true;
        this.text='success'
        this.color='success'
      }else{
        this.show=true;
        this.text='error'
        this.color='danger'
      }

    });
  }

  deleteProduct(id) {
    this.productService.deleteProduct(id)
      .pipe(first())
      .subscribe(
        res => {

          this.text='Producto creado'
          this.color='success'
          this.submitted = false;
          console.log(res);
        },
        error => {
          // this.loading = false;
        });
  }
}

