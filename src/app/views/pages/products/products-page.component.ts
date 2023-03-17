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
  products:any;
  selectFilter=null;
  /*category end*/
  private filters = {
    searchFilters: [
      { category: null },
      { subcategory: null },
      { supercategory: null },
      { colors: []},
      { sizes: [] },
      { attributes: []},
      { name: null},
    ]
  };
  private cart: Cart;

  attributes:any;
  attributes_group=[];
  private titleFilterCat: any;
  private titleFilterSubCat: any;
  private titleFilterSuperCat: any;
  private product_pg: any;
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
    this.loading=true;
    this.productService.getProducts()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.categories2 = data.data.category;
          this.colors = data.data.color;
          this.sizes = data.data.size;
          this.loading=false;
          this.product_pg = data.data.product_pg;
          this.product_pg.current_page = this.product_pg.current_page+'';
          this.products = this.product_pg.data;

//          this.router.navigate(['/shop/products']);
        },
        error => {
          //this.toastr.error('Invalid request', 'Toastr fun!');
          // this.loading = false;
          this.loading=false;
        });
    this.productService.getAttributes()
      .pipe(first())
      .subscribe(
        res => {
          this.attributes = res.data.attributes;
          this.attributes_group = res.data.attributes_group;
          this.attributes_group = res.data.attributes_group;
          console.log('this.attributes_group');
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
  showFilter(attr){
    console.log(attr.key)
    this.selectFilter = (this.selectFilter === attr.key) ? null : attr.key;
  }
  showCategory(){
    this.openCategory = !this.openCategory;
  }
  showSize(){
    this.openSize = !this.openSize;
  }
  showProductType(cat) {
    this.loading=true;
    this.openProductTypeCat = 0;
    this.openProductType = cat.id;
    this.titleFilterCat = cat.name
    this.titleFilterSubCat =null;
    this.titleFilterSuperCat =null;
    console.log(this.filters.searchFilters[0].category);
    console.log(cat.id);
    this.filters.searchFilters[0].category = cat.id
    console.log(this.filters.searchFilters[0].category);
    this.filters.searchFilters[1].subcategory = null
    this.filters.searchFilters[2].supercategory = null
    this.filterProducts();
  }
  showproductTypeCat(cat, subcat) {
    this.loading=true;
    this.openProductTypeSubCat = 0;
    this.openProductType = cat.id;
    this.openProductTypeCat = subcat.id;
    this.titleFilterSubCat = subcat.name;
    this.titleFilterSuperCat =null;
    this.filters.searchFilters[0].category = null
    this.filters.searchFilters[1].subcategory = subcat.id
    this.filterProducts();
  }
  showproductTypeSubCat(cat, subcat, supercat) {
    this.loading=true;
    this.openProductType = cat.id;
    this.openProductTypeCat = subcat.id;
    this.openProductTypeSubCat = supercat.id;
    this.titleFilterSuperCat = supercat.name;
    this.filters.searchFilters[0].category = null
    this.filters.searchFilters[1].subcategory = null
    this.filters.searchFilters[2].supercategory = supercat.id

    this.filterProducts();

  }
  /*end category filters*/
  loading=false;
  searchOpen=false;

  setFiltersOpen() {
    this.filtersOpen = !this.filtersOpen;
  }

  filterProducts(){
    this.product_pg.current_page = 1+'';
    this.productService.sendFilters(this.filters,this.product_pg.current_page).subscribe(
      data => {
        //this.products = data.data.product;
        this.loading=false;
        this.product_pg = data.data.product_pg;
        this.product_pg.current_page = this.product_pg.current_page+'';
        this.products  = this.product_pg.data;
        console.log(this.products )
        this.products  = this.getObjectValues( this.products );
        console.log(this.products )

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
        //          this.router.navigate(['/shop/products']);
      },
      error => {
        //this.toastr.error('Invalid request', 'Toastr fun!');
        this.loading = false;
      });
  };

  //nose porque al hacer la paginacion y hacer la 2 consulta el obteto data no es un array como se espera por eso esta funcion
  /*
  Esta función utiliza Array.isArray y typeof para verificar si el valor es un array o un objeto, respectivamente. Luego, si es un array,
   filtra los elementos que sean objetos y crea un nuevo array con ellos usando Array.filter
   Si es un objeto, extrae los valores del objeto usando Object.values, filtra los elementos que sean objetos y crea un nuevo array con ellos.
   */

  getObjectValues(value) {
    if (Array.isArray(value)) {
      return value.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item));
    } else if (typeof value === 'object' && value !== null) {
      return Object.values(value).filter(item => typeof item === 'object' && item !== null && !Array.isArray(item));
    } else {
      return [];
    }
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
    this.product_pg.current_page=pr;
    //this.filterProducts();
    this.productService.sendFilters(this.filters,this.product_pg.current_page).subscribe(
      data => {
        //this.products = data.data.product;
        this.loading=false;
        this.product_pg = data.data.product_pg;
        this.product_pg.current_page = this.product_pg.current_page+'';
        this.products  = this.product_pg.data;
        console.log(this.products )
        this.products  = this.getObjectValues( this.products );
        console.log(this.products )

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
        //          this.router.navigate(['/shop/products']);
      },
      error => {
        //this.toastr.error('Invalid request', 'Toastr fun!');
        this.loading = false;
      });
  }

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
    this.loading=true;
    console.log(color);
    const index = this.filters.searchFilters[5].attributes.findIndex(c => c.id === color.id);
    let el = document.querySelector(`input[name='${color.id}']`) as HTMLInputElement;

    if (index !== -1) {
      this.filters.searchFilters[5].attributes.splice(index, 1);
      el.checked = false;
    } else {
      this.filters.searchFilters[5].attributes.push({ id: color.id, value:color.value });
      el.checked = true;
    }
    console.log(this.filters.searchFilters[5].attributes);
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

  detail(id_product: number, id_variation: any) {
    console.log(id_product)
    console.log(id_variation)
    //this.router.navigate(['/admin/edit-product'],id);
    this.router.navigate(
      ['/shop/product-detail'],
      { queryParams: { id_product,id_variation } }
    );
  }

  openSearch() {

  }
  searchProduct(event, product) {
    console.log(event)
    this.loading=true;
    console.log(event.target.value)
    this.filters.searchFilters[6].name = event.target.value;

    this.filterProducts();
  }
}
