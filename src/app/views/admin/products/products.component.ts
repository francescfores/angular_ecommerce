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
import {SharedService} from "../../../services/api/shared.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  imgUrl=environment.apiUrl;

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
  autocloseTime=2000;
  private product_pg: any;


  public variationsForm: FormGroup[]=[];
  selectedFileVariations=[];
  create_product: boolean;

  constructor(
    private router: Router,
    private productService: ProductService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
  ) {
    this.product = new Product();
    this.category = new Category();
    this.category = new Category();
    this.subcategory = new SubCategory();
    this.supercategory = new SuperCategory();
    this.registerForm = this.formBuilder.group({
      name: ['1', Validators.required],
      desc: ['1', Validators.required],
      price: ['1', Validators.required],
      stock: ['1', Validators.required],
      img: ['', Validators.required],
      category: [null ],
      subcategory: [null ],
      supercategory: [null ],
      attributes: [null ],
    });
  }

  ngOnInit() {
    this.productService.getProductsPaginated(1)
      .pipe(first())
      .subscribe(
        data => {
          this.categories = data.data.category;
          this.products = data.data.product_admin;
          this.product_pg = data.data.product_admin;
          this.product_pg.current_page =data.data.product_admin.current_page+'';
          this.colors = data.data.color;
          this.sizes = data.data.size;
        },
        error => {
        });
    this.productService.getAttributes()
      .pipe(first())
      .subscribe(
        res => {
          this.attributes = res.data.attributes;
          this.attributes_group = res.data.attributes_group;
          this.loadSelects();
        },
        error => {
        });
    this.productService.getCategories()
      .pipe(first())
      .subscribe(
        res => {
          this.categories = res.data.category;
        },
        error => {
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

  loadSelects() {
    for (const key of Object.keys(this.attributes_group)) {
      this.selectedOptions[key] = null;
    }
  }

  productType(test) {
    this.type = Number(test.target.value);
  }

  selectVariation(seleccionado: any) {
    console.log('seleccionado',seleccionado)

    if(seleccionado!==null){
      const attribute = this.attributes.find(x => x.id === Number(seleccionado));
      console.log('attribute',attribute)

      console.log('this.variationsSelected',this.variationsSelected)
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
    }
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
        this.show=true;
        this.text='La variaicon ya existe!'
        this.color='warning'
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
  //TODO
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

  setDataForm(){
    this.product.type = this.type;
    this.product.name = this.f.name.value;
    this.product.desc = this.f.desc.value;
    this.product.price = this.f.price.value;
    this.product.stock = this.f.stock.value;
    this.product.img = this.selectedFile;
    this.product.category = this.category.id;
    this.product.subcategory = this.subcategory.id;
    this.product.supercategory = this.supercategory.id;
    this.product.variations = this.variations;
  }

  createProduct(){
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
          this.text='Error del servidor'
          this.color='error'
          this.submitted = false;
        });
  }

  create() {
    this.submitted = true;
    this.text='esperando el servior creado'
    this.color='info'
    this.show=true;
    console.log(this.type);
    //this.loading = true;
      if (this.registerForm.valid) {
        if(this.type===1){
          console.log(this.variations);
          console.log(this.variations[0]);
          this.createVariation();
          this.setDataForm();
          this.createProduct();
        }else {
          let valid = false;
          Object.entries(this.variationsForm).forEach(([key, value], index) => {
            if(value.valid){
              this.setDataForm();
              valid = true;
            }else{
              this.show=true;
              this.text='Variacion incorrecta'
              this.color='danger'
            }
          });
          if(valid){
            this.createProduct();
          }
        }
    }else {
        this.show=true;
        this.text='Formulario incorreco'
        this.color='danger'
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
  getPaginated(page){
    this.productService.getProductsPaginated(page)
      .pipe(first())
      .subscribe(
        data => {
          this.product_pg = data.data.product_admin;
          this.product_pg.current_page = data.data.product_admin.current_page+'';
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }
  paginated(pr) {
    this.product_pg.current_page=this.sharedService.paginated(pr, this.product_pg);
    this.getPaginated(pr)
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
    this.selectedFile = event.target.files;
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }
  onFileChangedVariation(event,id) {
   // this.selectedFileVariations[id] = event.target.files[0];
    this.selectedFileVariations[id] = event.target.files;
    //this.variations[id].img = event.target.files[0];
    this.variations[id].imgs = event.target.files;
    console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    console.log(event.target.files);
    console.log(this.selectedFileVariations[id]);
    console.log(this.variations[id]);
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }
  saveVariation(variation: any) {
    console.log(this.variationsForm);
    console.log(variation.id);
      this.variations.find(x=>x.id ===variation.id).price=this.f.price.value;
      this.variations.find(x=>x.id ===variation.id).stock=this.f.stock.value;
      this.variations.find(x=>x.id ===variation.id).price=this.fv(variation.id).price.value;
      this.variations.find(x=>x.id ===variation.id).stock=this.fv(variation.id).stock.value;
    this.product.variations=this.variations;
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

