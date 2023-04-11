import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../services/api/product.service";
import {Cart} from "../../../../models/cart";
import {first} from "rxjs/operators";
import {Product, Variation} from "../../../../models/product";
import {CartService} from "../../../../services/api/cart.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
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
  selectedVariation=null;
  images:any;
  selectedImage=0;
  getCartFromLocalStorage() {

    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
    console.log('getCartFromLocalStorage')
    console.log(this.cart)
  }


  saveCartToLocalStorage() {
    console.log('saveCartToLocalStorage')
    console.log(this.cart)
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  ngOnInit() {
    this.getParams();
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
    this.productService.getProductById(this.id_product)
      .pipe(first())
      .subscribe(
        data => {
          this.product = data.data;
          this.getCartFromLocalStorage();
          //listamos las variaciones
          Object.entries(this.product.variations).forEach(([key, value], index) => {
            //listamos los atributos de las variaciones
            value.attributes.forEach(atributo => {
              //agregamos el atributo de la variacion
              this.attributes.push(atributo);
            });
          });
          //agrupamos los atributos
          this.groupAttributes();
          this.selectedVariation = this.product.variations.find(x=>x.id ===Number(this.id_variation));
          this.selectedVariation.count=1;
          this.selectedVariation.total=this.selectedVariation.price;
          this.selectedVariation.attributes.forEach(atributo => {
            this.selectedOptions[atributo.name]=this.attributes_group[atributo.name].find(x=>x.id===atributo.id).id;
            this.selectAttribute(atributo.id);
          });
          this.images=[
            {id:1, path:this.selectedVariation?.img},
            {id:2, path:this.selectedVariation?.img},
            {id:3, path:this.selectedVariation?.img},
            {id:4, path:this.selectedVariation?.img}
          ]
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
    if(isNaN(Number(attribute))){
      delete this.selectAttributes[attribute];
    }else {
      attribute=Number(attribute);
      attribute = this.attributes.find(x=>x.id===attribute);
      this.selectAttributes[attribute.name]=attribute;
      Object.keys(this.attributes_group).forEach(attName =>{
        this.attributes_group[attName].forEach(item2 =>{
          console.log()
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
          }
        }
    });
    if(!this.valid){
      this.selectedVariation=null;
    }
  }

  updateCount(event, product: Product) {
    console.log('---------------update----------------')
    let count = this.selectedVariation.count =  Number(event.target.value);
    let total=parseFloat(this.selectedVariation.price);
    this.selectedVariation.total = (count*total).toFixed(2);
    this.selectedVariation.count=count;

  }

  getVariaitonById(){
    this.productService.getVariationById(this.id_variation)
      .pipe(first())
      .subscribe(
        res => {
          this.variation = res.data;
          let count = Number(this.selectedVariation.count);
          console.log(this.selectedVariation.count)
          this.selectedVariation.product = this.product;
          console.log(this.selectedVariation);
          for (let i = count;i!==0;i--){
            this.cart.products.push(this.variation)
            this.cartService.addProduct(this.variation)
          }
          console.log(this.cart.products)
          this.saveCartToLocalStorage();
        },
        error => {
        });
  }


  addToCart() {
    console.log('addToCart')
    console.log(this.cart.products)

    this.getVariaitonById();

  }

  selectetNextImage() {
    console.log(this.selectedImage)
    if(this.images.length-1>this.selectedImage){
      this.selectedImage++;
    }
  }

  selectetPreviousImage() {
    console.log(this.selectedImage)
    if(0<this.selectedImage){
      this.selectedImage--;
    }
  }
}
