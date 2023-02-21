import {Component, OnDestroy, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ProductService} from "../../../services/api/product.service";
import {Product, Variation} from "../../../models/product";
import {Cart} from "../../../models/cart";

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styles: []
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  /*category filters*/
  categories2:any;
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
  products:Variation[]=[];
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

  addProductToCart(product: Variation) {
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
    this.productService.sendFilters(this.filters).subscribe(
      data => {
        this.products = data.data.product;
        //console.error('this.products')
        //console.log(this.products)
        //console.log(this.products[3]?.variations[0])
        /*this.products  = data.data.product.flatMap(product => {
          if (product.type===2) {
            return product.variations.map(variation => ({
              id: variation.id,
              name: `${product.name}`,
              price: variation.price,
              img: variation.img,
              stock: variation.stock,
              type: product.type,
              product: product,
            }));
          } else {
            return [product];
          }
        }) ;
        */
        /*
        this.products = this.products.reduce((accumulator, product) => {
          if (product.type === 2) {
            const colorVariations = product.variations.filter(variation => {
              const attributes = variation.attributes;
              return attributes && attributes.find(attr => attr.name === 'color');
            });
            if (colorVariations.length === 0) {
              return accumulator;
            }
            const variations = colorVariations.map(variation => ({
              id: variation.id,
              name: `${product.name}`,
              price: variation.price,
              img: variation.img,
              stock: variation.stock,
              type: product.type,
              product: product,
            }));
            return accumulator.concat(variations);
          } else {
            return accumulator.concat(product);
          }
        }, []);
        */
        console.log(this.products)
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
