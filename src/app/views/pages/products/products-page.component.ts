import {Component, OnDestroy, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {ProductService} from "../../../services/api/product.service";
import * as slider from './../../../../assets/js/slider.js';
import {Product} from "../../../models/product";
import {Cart} from "../../../models/cart";
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styles: []
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  /*category filters*/
  categories2:any;
  productTypes = [
    {
      id:1,
      name:'Ropa',
      desc:'ProductType',
      categories :[
        {
          id:1,
          name:'Camisetas',
          subcategories :[
            {id:1,name:'Camisetas básicas'},
            {id:2,name:'Camisetas print'},
            {id:3,name:'Camisetas sin mangas'},
          ]},
        {
          id:2,
          name:'Sudaderas',
          subcategories :[
            {id:1,name:'Sudaderas con capucha'},
            {id:2,name:'Sudaderas'},
            {id:3,name:'Sudaderas con cremallera'},
          ]},
      ]},
    {
      id:2,
      name:'Zapatos',
      desc:'ProductType',
      categories :[
        {
          id:1,
          name:'Camisetas',
          subcategories :[
            {id:1,name:'Camisetas básicas'},
            {id:2,name:'Camisetas print'},
            {id:3,name:'Camisetas sin mangas'},
          ]},
        {
          id:2,
          name:'Sudaderas',
          subcategories :[
            {id:1,name:'Sudaderas con capucha'},
            {id:2,name:'Sudaderas'},
            {id:3,name:'Sudaderas con cremallera'},
          ]},
      ]}
    ]
  filtres = [
    {
      name:'Colors',
      subcategories :[
        {id:1,name:'White'},
        {id:2,name:'Blue'},
        {id:3,name:'Brown'},
      ]},
    {
      name:'Size',
      subcategories :[
        {id:1,name:'S'},
        {id:2,name:'M'},
        {id:3,name:'L'},
        {id:4,name:'XL'},
      ]},
  ];
  filtersOpen = false;
  colors;
  sizes;

  openColors=false;
  openCategory=false;
  openSize=false;
  openProductType;
  openProductTypeCat;
  openProductTypeSubCat;
  titleFilter;
  products;
  /*category end*/
  private filters = {
    searchFilters: [
      { category: null },
      { subcategory: null },
      { supercategory: null },
      { colors: []},
      { sizes: [] },
      { attributes: []},
    ]
  };
  private cart: Cart;

  attributes:any;
  attributes_group=[];
  constructor(
    private router: Router,
    private productService: ProductService,
  ) {
    this.cart = new Cart();
    this.getCartFromLocalStorage();
  }

  addProductToCart(product: Product) {
    this.cart.products.push(product);
    this.saveCartToLocalStorage();
    console.log(this.cart)
  }

  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
    console.log(this.cart)
  }

  ngOnInit() {
    this.productService.getProducts()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.categories2 = data.data.category;
          this.products = data.data.product;
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
          this.attributes_group = res.data.attributes_group;
          console.log(this.attributes_group);
//          this.router.navigate(['/shop/products']);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
  }
  ngOnDestroy() {
  //  slider.resetSlider();
  }
  /*category filters*/
  showColors(){
    this.openColors = !this.openColors;
  }
  showCategory(){
    this.openCategory = !this.openCategory;
  }
  showSize(){
    this.openSize = !this.openSize;
  }
  showProductType(cat) {
    this.openProductTypeCat = 0;
    this.openProductType = cat.id;
    this.titleFilter = cat.name
    console.log(this.filters.searchFilters[0].category);
    console.log(cat.id);
    this.filters.searchFilters[0].category = cat.id
    console.log(this.filters.searchFilters[0].category);
    this.filters.searchFilters[1].subcategory = null
    this.filters.searchFilters[2].supercategory = null
    this.filterProducts();
  }
  showproductTypeCat(cat, subcat) {
    this.openProductTypeSubCat = 0;
    this.openProductType = cat.id;
    this.openProductTypeCat = subcat.id;
    this.titleFilter = subcat.name;
    this.filters.searchFilters[0].category = null
    this.filters.searchFilters[1].subcategory = subcat.id
    this.filterProducts();
  }
  showproductTypeSubCat(cat, subcat, supercat) {
    this.openProductType = cat.id;
    this.openProductTypeCat = subcat.id;
    this.openProductTypeSubCat = supercat.id;
    this.titleFilter = supercat.name;
    this.filters.searchFilters[0].category = null
    this.filters.searchFilters[1].subcategory = null
    this.filters.searchFilters[2].supercategory = supercat.id

    this.filterProducts();

  }
  /*end category filters*/
  setFiltersOpen() {
    this.filtersOpen = !this.filtersOpen;
  }

  filterProducts(){
    console.log(this.filters);
    this.productService.sendFilters(this.filters).subscribe(
      data => {
        this.products = data.data.product;
//          this.router.navigate(['/shop/products']);
      },
      error => {
        //this.toastr.error('Invalid request', 'Toastr fun!');
        // this.loading = false;
      });
  };

  onCategorySelected(category: any) {
    this.filters.searchFilters[0].category = category.id;
    this.filterProducts();
  }
  onSubCategorySelected(subcategory: any) {
    this.filters.searchFilters[1].subcategory = subcategory.id;
    this.filterProducts();
  }
  onSuperCategorySelected(supercategory: any) {
    this.filters.searchFilters[2].supercategory = supercategory.id;
    this.filterProducts();
  }

  onAttributeSelected(color: any) {
    const index = this.filters.searchFilters[5].attributes.findIndex(c => c.id === color.id);
    if (index !== -1) {
      this.filters.searchFilters[5].attributes.splice(index, 1);
    } else {
      this.filters.searchFilters[5].attributes.push({ id: color.id });
    }
    this.filterProducts();
  }

  onColorSelected(color: any) {
    const index = this.filters.searchFilters[3].colors.findIndex(c => c.id === color.id);
    if (index !== -1) {
      this.filters.searchFilters[3].colors.splice(index, 1);
    } else {
      this.filters.searchFilters[3].colors.push({ id: color.id });
    }
    this.filterProducts();
  }
  onSizeSelected(size: any) {
    const index = this.filters.searchFilters[4].sizes.findIndex(c => c.id === size.id);
    if (index !== -1) {
      this.filters.searchFilters[4].sizes.splice(index, 1);
    } else {
      this.filters.searchFilters[4].sizes.push({ id: size.id });
    }
    this.filterProducts();

  }

}
