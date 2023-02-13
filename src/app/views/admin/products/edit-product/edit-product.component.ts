import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {first} from "rxjs/operators";
import {ProductService} from "../../../../services/api/product.service";
import {Category} from "../../../../models/category";
import {SubCategory} from "../../../../models/subcategory";
import {SuperCategory} from "../../../../models/supercategory";
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Product, Variation} from "../../../../models/product";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  id: number;
  queryObj: any;

  categories: Category[]= [];
  subcategories: SubCategory[] = [];
  supercategories: SuperCategory[]= [];

  category: Category;
  subcategory: SubCategory;
  supercategory: SuperCategory;

  private products: string;
  colors: any;
  private sizes: any;

  variations : Variation[] = [];
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
  selectedFileVariations=[];

  //form
  submitted = false;
  public registerForm: FormGroup;
  public variationsForm: FormGroup[]=[];
  loading = false;
  product:Product;

  //alert
  text: any;
  color: any;
  show=false;
  autocloseTime=20000;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,

  ) {
    this.route.params.subscribe((params: Params) => this.id = params.id);
    this.product = new Product();
    this.category = new Category();
    this.category = new Category();
    this.subcategory = new SubCategory();
    this.supercategory = new SuperCategory();

  }

  get f() {
    return this.registerForm.controls;
  }
   fv(i) {
    return this.variationsForm[i].controls;
  }
  ngOnInit() {
    this.getParams();
    this.getCategories();
    this.getAttributes();
    this.getProduct();

  }
  getParams(){
    this.route.queryParamMap
      .subscribe((params) => {
          this.queryObj = { ...params.keys, ...params };
          this.id =this.queryObj.params.id;
        }
      );
  }
  getProduct(){
    this.productService.getProductById(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.product = data.data;
          this.product.variations = data.data.variations;
          this.variations = this.product.variations;
          this.selectedFileVariations[this.variations.length]=this.selectedFile;
          this.category = this.categories.find(x=>x.id===Number(this.product.category.id ));
          if (this.category) {
            // La propiedad category no está definida
            this.subcategories= this.category.subcategories;
            this.subcategory = this.subcategories.find(x=>x.id===Number(this.product.subcategory.id ));
            this.supercategories= this.subcategory.supercategories;
            this.supercategory = this.supercategories.find(x=>x.id===Number(this.product.supercategory.id ));
          }
          console.log(this.product.category.id);
          console.log(this.category);
          console.log(this.product.img);

          //init forms
          this.registerForm = this.formBuilder.group({
            name: [this.product.name, Validators.required],
            desc: [this.product.desc, Validators.required],
            price: [this.product.price, Validators.required],
            img: [this.product.img, []],
            stock: [this.product.stock, Validators.required],
            category: [this.product.category ? this.product.category.id : null, Validators.required],
            subcategory: [this.product.subcategory ? this.product.subcategory.id : null, Validators.required],
            supercategory: [this.product.supercategory ? this.product.supercategory.id : null, Validators.required],
          });

          if(this.variations){
            console.log('show variations');
            this.type=2;
            Object.entries(this.variations).forEach(([key, value], index) => {
              // name Bobby Hadz 0
              // country Chile 1
              console.log(key, value, index);
              //this.f.stock.setValue('');
              this.variationsForm.push(
                this.formBuilder.group({
                  price: [value.price, Validators.required],
                  stock: [value.stock, Validators.required],
                  img: [value.img, []],
                })
              ) ;

            });
            console.log(this.variationsForm);

          }




        },
        error => {
        });
  }
  getAttributes(){
    this.productService.getAttributes()
      .pipe(first())
      .subscribe(
        res => {
          this.attributes = res.data.attributes;
          this.attributes_group = res.data.attributes_group;
//          this.router.navigate(['/shop/products']);
        },
        error => {
          // this.loading = false;
        });
  }
  getCategories(){
    this.productService.getCategories()
      .pipe(first())
      .subscribe(
        res => {
          this.categories = res.data.category;

//          this.router.navigate(['/shop/products']);
        },
        error => {
          // this.loading = false;
        });
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
        this.selectedFileVariations[this.variations.length]=this.selectedFile;

      }
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
      if (this.registerForm.valid) {
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
            this.show=true;
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
        //validation variations
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
        this.productService.updateProduct2(this.product.id,this.product)
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
        this.submitted = false;
        this.show=true;
        this.text='Producto creado'
        this.color='success'
      }else{
        console.log(this.f.img.value);
        console.log(this.f.price.value);
        console.log(this.f.price.errors);
        console.log(this.f.img.errors);
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

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log('update image')
    console.log(this.selectedFile )
    this.productService.uploadImage(this.product.id,this.selectedFile)
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
    //this.registerForm.controls.img.setValue(this.selectedFile);
  }
  onFileChangedVariation(event,id) {
    this.selectedFileVariations[id] = event.target.files[0];
    this.productService.uploadImageVariation(id,this.selectedFileVariations[id])
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
    console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    console.log(event.target.files[0]);
    console.log(this.selectedFileVariations[id]);
    console.log(this.selectedFileVariations[id].name);
    //this.registerForm.controls['img'].setValue(this.selectedFile);
  }
}
