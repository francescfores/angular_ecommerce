import { Component, OnInit } from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/api/authentication.service";
import {ProductService} from "../../../services/api/product.service";

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styles: []
})
export class ProductsPageComponent implements OnInit {
  /*category filters*/

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
      id:1,
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
      ]},
    {
      name:'Colors',
      subcategories :[
        {name:'White'},
        {name:'Blue'},
        {name:'Brown'},
      ]},
    {
      name:'Category',
      subcategories :[
        {name:'New Arrivals'},
        {name:'Sale'},
      ]},
    {
      name:'Size',
      subcategories :[
        {name:'S'},
        {name:'M'},
        {name:'L'},
        {name:'XL'},
      ]},
  ];
  filtersOpen = false;
  colors = this.filtres.find(x => x.name === 'Colors').subcategories;
  categories = this.filtres.find(x => x.name === 'Category').subcategories;
  sizes = this.filtres.find(x => x.name === 'Size').subcategories;

  openColors=false;
  openCategory=false;
  openSize=false;
  openProductType;
  openProductTypeCat;
  openProductTypeSubCat;
  titleFilter;
  /*category end*/
  constructor(
    private router: Router,
    private productService: ProductService,
  ) {
  }
  ngOnInit() {

    this.productService.getProduct()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
//          this.router.navigate(['/shop/products']);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
        });
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
  showProductType(productType) {
    this.openProductTypeCat = 0;
    this.openProductType = productType.id;
    this.titleFilter = productType.name;
  }
  showproductTypeCat(productType, productTypeCat) {
    this.openProductTypeSubCat = 0;
    this.openProductType = productType.id;
    this.openProductTypeCat = productTypeCat.id;
    this.titleFilter = productTypeCat.name;
  }
  showproductTypeSubCat(productType, productTypeCat, productTypeSubCat) {
    this.openProductType = productType.id;
    this.openProductTypeCat = productTypeCat.id;
    this.openProductTypeSubCat = productTypeSubCat.id;
    this.titleFilter = productTypeSubCat.name;

  }
  /*end category filters*/
  setFiltersOpen() {
    this.filtersOpen = !this.filtersOpen;
  }

  filterProducts(){

  };

}
