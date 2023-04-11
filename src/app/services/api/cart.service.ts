import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Variation} from "../../models/product";
import {Cart} from "../../models/cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(new Cart());
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }
  private loadCartFromLocalStorage() {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      const cart = JSON.parse(cartJson);
      this.cartSubject.next(cart);
    }
  }

  updateCart(cart: Cart) {
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addProduct(variation:any) {
    const currentCart = this.cartSubject.getValue();
    const updatedCart = { ...currentCart };
    updatedCart.products.push(variation);
    updatedCart.total += variation.price;
    this.updateCart(updatedCart);
  }

  removeProduct(variation) {
    const currentCart = this.cartSubject.getValue();
    const updatedCart = { ...currentCart };
    // Eliminar todos los productos con el ID especificado
    updatedCart.products = updatedCart.products.filter(item => item.id !== variation.id);
    // Calcular el nuevo total del carrito
    updatedCart.total =  updatedCart.total - variation.total;

    this.updateCart(updatedCart);
  }

  groupProducts() {
    const cart = this.cartSubject.getValue();
    const groupedProducts = [];

    cart.products.forEach(product => {
      const existingProduct = groupedProducts.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.count++;
        existingProduct.total += Number(product.price);
      } else {
        groupedProducts.push({
          product: product.product,
          id: product.id,
          img: product.img,
          count: 1,
          price: Number(product.price),
          total: Number(product.price)
        });
      }
    });
    cart.total = groupedProducts.reduce((acc, curr) => acc + curr.total, 0);
    console.log('cart.total',cart.total)
    this.updateCart(cart);
    return groupedProducts;
  }

  selectQuantityProduct(num, product) {
    const cart = this.cartSubject.getValue();
    if (num > 0) {
      product.total = Math.round((num*product.price) * 100) / 100
      product.count = Number(num)
      this.removeProduct(product)
      for (let i = product.count;i!==0;i--){
        this.addProduct(product)
      }
    }
  }
}
