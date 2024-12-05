import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../services/api/product.service";
import {Cart} from "../../../../models/cart";
import {first} from "rxjs/operators";
import {Product, Variation} from "../../../../models/product";
import {CartService} from "../../../../services/api/cart.service";
import {environment} from "../../../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  imgUrl=environment.apiUrl;

  selectAttributes=[];
  private valid: boolean;
  private addedCart=false;
  private variation: any;
  private loaded=false;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastr: ToastrService
  ) {
    this.cart = new Cart();
  }

  private cart: Cart;
  attributes=[];
  attributes_group=[];
  id: number;
  queryObj: any;
  private product: Product;
  private id_variation: any;
  private id_product: any;
  private selectedsAttributes: any;
  selectedOptions: any = {};
  selectedAttributes: any;
  selected_attributes = {}; // Objeto para almacenar los atributos seleccionados por el usuario
  selectedVariation:Variation=new Variation();
  images=[]
  selectedImage=0;
  ngOnInit() {
    this.selectedVariation=new Variation();
    console.log(this.selectedVariation);
    this.getParams();
  }
  getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
  }
  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  getParams(){
    this.route.queryParamMap
      .subscribe((params) => {
          this.queryObj = { ...params.keys, ...params };
        this.id_product =this.queryObj.params.id_product;
        this.id_variation =this.queryObj.params.id_variation;
        this.getProductById();
        }
      );
  }
  getProductById(){
    this.loaded=false;
    this.productService.getProductById(this.id_product)
      .pipe(first())
      .subscribe(
        data => {
          this.product = data.data;
          this.getCartFromLocalStorage();
          console.log('--------selectet variation----------');
          console.log(this.cart);

          //listamos las variaciones
          if(this.product.type===2){
            Object.entries(this.product.variations).forEach(([key, value], index) => {
              //listamos los atributos de las variaciones
              value.attributes.forEach(atributo => {
                //agregamos el atributo de la variacion
                this.attributes.push(atributo);
              });

              // Object.entries(value.imgs).forEach(([key, value2], index) => {
              //   this.images.push(value2.path)
              //   console.log(value2);
              // });
              console.log(value);
              console.log(this.images);

            });
            this.groupAttributes();
            this.selectedVariation.count=1;
            this.selectedVariation.total=this.selectedVariation.price;
            //this.selectedVariation = this.product.variations[0];
            this.selectedVariation = this.product.variations.find(x=>x.id=== +this.id_variation);
              if(this.selectedVariation?.imgs?.length===0){
                // product.selectedVariation.imgs= product.selectedVariation.attributes.find(x=>x.name==='color').imgs
                this.selectedVariation.imgs= this.product.variations.find(variation => {
                  return variation.attributes.some(attribute => {
                    return  variation.imgs.length>0;
                  });
                }).imgs
                console.log(this.selectedVariation);
              }
            console.log(this.product);
            console.log(this.id_variation);
            console.log(this.selectedVariation);

            this.selectedVariation.attributes.forEach(atributo => {
              this.selectedOptions[atributo.name]=this.attributes_group[atributo.name].find(x=>x.id===atributo.id).id;
              this.selectAttribute(atributo.id);
            });
          }else {
            this.selectedVariation.count=1;
            this.selectedVariation.total=this.product.price;
            this.selectedVariation.price=this.product.price;
            this.valid=true;
            Object.entries(this.product.imgs).forEach(([key, value], index) => {
              this.images.push(value.path)
            });

          }
          this.loaded=true;


          //agrupamos los atributos

          /*

          this.images=[
            {id:1, path:this.selectedVariation?.img},
            {id:2, path:this.selectedVariation?.img},
            {id:3, path:this.selectedVariation?.img},
            {id:4, path:this.selectedVariation?.img}
          ]

          */
          this.loaded=true;
        },
        error => {
        });
  }
  selectAttribute2(attribute) {
    this.selected_attributes[attribute.name] = attribute;

    this.checkAttributes(this.selected_attributes[attribute.name]);
  }
  selectAttribute(attribute){
    this.checkAttributes(attribute)
  }
  private groupAttributes() {
    this.attributes_group=[];
    //recoremos todos los atributos
    this.attributes.forEach(a => {
      //si el grupo no existe (color) se crea un array vacio (color:[])
        if (!this.attributes_group[a.name]) {
          this.attributes_group[a.name] = [];
        }
        //por defecto desabilitado
        a.disabled = true;
        //buscamos dentro del grupo (color) si existe un atributo igual
        let exist = this.attributes_group[a.name].find(x=>x.id ===a.id);
        //si no existe lo agregamos
        if(!exist){
          this.attributes_group[a.name].push(a);
        }
    });
  }
  checkAttributes(attribute){
    this.loaded=false;
    if(isNaN(Number(attribute))){
      delete this.selectAttributes[attribute];
    }else {
      attribute=Number(attribute);
      attribute = this.attributes.find(x=>x.id===attribute);
      this.selectAttributes[attribute.name]=attribute;
      Object.keys(this.attributes_group).forEach(attName =>{
        this.attributes_group[attName].forEach(item2 =>{
          if(item2.name!==attribute.name){
            item2.disabled =true;
          }
        });
      });
    }
    const selectedAttributesIds = Object.values(this.selectAttributes).map(att => att.id);
    this.valid = false;

    this.product.variations.forEach(variation => {
      const variationAttributesIds = variation.attributes.map(x => x.id);
      if(variationAttributesIds.includes(attribute.id)){
        variation.attributes.forEach(att => {
            this.attributes_group[att.name].find(x=>x.id===att.id).disabled=false;
        });
      }
      if(selectedAttributesIds.every(attributeId => variationAttributesIds.includes(attributeId))){
        const count_variations = variation.attributes.length;
        const count_select_att = Object.keys(this.selectAttributes).length;
          if(count_select_att===count_variations){
            this.valid= true;
            this.selectedVariation=variation;
            this.selectedVariation.count=1;
            this.selectedVariation.total=variation.price;

           /*
            this.images=[
              {id:1, path:this.selectedVariation?.img},
              {id:2, path:this.selectedVariation?.img},
              {id:3, path:this.selectedVariation?.img},
              {id:4, path:this.selectedVariation?.img}]
            */
          }
        }
    });
    this.images=[];
    if(this.selectedVariation?.imgs?.length===0){
      // product.selectedVariation.imgs= product.selectedVariation.attributes.find(x=>x.name==='color').imgs
      this.selectedVariation.imgs= this.product.variations.find(variation => {
        return variation.attributes.some(attribute => {
          return  variation.imgs.length>0;
        });
      }).imgs
      console.log(this.selectedVariation);
    }
    Object.entries(this.selectedVariation.imgs).forEach(([key, value2], index) => {
      this.images.push(value2.path)
      console.log(value2);
    });
    console.log(this.selectedVariation);
    console.log(this.images);

    if(!this.valid){
      this.selectedVariation=null;
    }
    this.loaded=true;

  }
  updateCount(event, product: Product) {
    let count = this.selectedVariation.count =  Number(event.target.value);
    let total=parseFloat(this.selectedVariation.price);
    this.selectedVariation.total = (count*total).toFixed(2);
    this.selectedVariation.count=this.selectedVariation.total;
    console.log(count)
    console.log(total)
    console.log(this.selectedVariation.total)
    console.log(this.selectedVariation.count)
  }
  addVariaitonToCart(){
    this.productService.getVariationById(this.selectedVariation.id)
      .pipe(first())
      .subscribe(
        res => {
          this.variation = res.data;
          let count = Number(this.selectedVariation.count);
          this.selectedVariation.product = this.product;
          for (let i = count;i!==0;i--){
            this.cart.products.push(this.variation)
            this.cartService.addProduct(this.variation)
          }
          this.saveCartToLocalStorage();
        },
        error => {
        });
  }
  addProductToCart(){
    this.productService.getProductsById(this.product.id)
      .pipe(first())
      .subscribe(
        res => {
          this.variation = res.data;
          let count = Number(this.selectedVariation.count);
          this.selectedVariation.product = this.product;
          for (let i = count;i!==0;i--){
            this.cart.products.push(this.product)
            this.cartService.addProduct(this.product)
          }
          this.saveCartToLocalStorage();
        },
        error => {
        });
  }

  addToCart() {
    this.toastr.info('Added to cart');
    if(this.product.type===2){
      this.addVariaitonToCart();
    }else{
      this.addProductToCart();
    }

  }
  selectetNextImage() {
    if(this.images.length-1>this.selectedImage){
      this.selectedImage++;
    }
  }
  selectetPreviousImage() {
    if(0<this.selectedImage){
      this.selectedImage--;
    }
  }
}
