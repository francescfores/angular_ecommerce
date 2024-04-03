import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Cart} from "../../../../models/cart";
import { Router} from "@angular/router";
import {StripeCardElement} from "@stripe/stripe-js";
import {StripeCardComponent} from "ngx-stripe";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartSubject = new BehaviorSubject<Cart>(new Cart());
  cart$ = this.cartSubject.asObservable();
  stripeCardElement: StripeCardComponent;
  currentStep$ = new BehaviorSubject<number>(1);
  currentStep = this.currentStep$.asObservable();
  basketValid=false;
  addressValid=false;
  shippingValid=false;
  paymentValid=false;
  private step: any;

  constructor(public router: Router) {
    this.loadCartFromLocalStorage();
    this.loadStepFromLocalStorage();

  }
  private loadCartFromLocalStorage() {
    const cartJson = localStorage.getItem('cart');
    //console.log('cartJson',cartJson)
    if (cartJson) {
      const cart = JSON.parse(cartJson);
      this.cartSubject.next(cart);
    }
  }

  loadStepFromLocalStorage(){
    const stepJson = localStorage.getItem('step');
    if (stepJson) {
      const step = JSON.parse(stepJson);
      this.currentStep$.next(step)
    }
    const basketValid = localStorage.getItem('basketValid');
    if (basketValid) {
      this.basketValid=JSON.parse(basketValid);
    }
    const addressValid = localStorage.getItem('addressValid');
    if (addressValid) {
      this.addressValid=JSON.parse(addressValid);
    }
    const shippingValid = localStorage.getItem('shippingValid');
    if (shippingValid) {
      this.shippingValid=JSON.parse(shippingValid);
    }
    const paymentValid = localStorage.getItem('paymentValid');
    if (paymentValid) {
      this.paymentValid=JSON.parse(paymentValid);
    }
    this.goStep(this.currentStep$.getValue())
  }

  updateCart(cart: Cart) {
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  updateStep(step) {
    this.currentStep$.next(step);
    localStorage.setItem('step', JSON.stringify(step));
    localStorage.setItem('basketValid', JSON.stringify(this.basketValid));
    localStorage.setItem('addressValid', JSON.stringify(this.addressValid));
    localStorage.setItem('shippingValid', JSON.stringify(this.shippingValid));
    localStorage.setItem('paymentValid', JSON.stringify(this.paymentValid));
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
    this.loadCartFromLocalStorage();
    const cart = this.cartSubject.getValue();
    const groupedProducts = [];
    console.log('----------groupProducts-----------')
    console.log(cart.products)
    cart.products.forEach(product => {
      const existingProduct = groupedProducts.find(item => item.id === product.id);
      console.log(product.type)
      if (existingProduct) {
        existingProduct.count++;
        existingProduct.total += Number(product.price);
      } else {
        if(product.type===undefined){
          groupedProducts.push({
            product: product.product,
            variation: product,
            id: product.id,
            img: product.img,
            count: 1,
            price: Number(product.price),
            total: Number(product.price)
          });
        }else {
          groupedProducts.push({
            product,
            id: product.id,
            img: product.img,
            count: 1,
            price: Number(product.price),
            total: Number(product.price),
          });
        }

      }
    });
    cart.total = groupedProducts.reduce((acc, curr) => acc + curr.total, 0);
    console.log('cart.total',cart.total)
    console.log(groupedProducts);
    this.updateCart(cart);
    return groupedProducts.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  selectQuantityProduct(num, product) {
    const cart = this.cartSubject.getValue();
    if (num > 0) {
      product.total = num*product.price//Math.round((num*product.price) * 100) / 100
      product.count = Number(num)
      this.removeProduct(product)
      for (let i = product.count;i!==0;i--){
        this.addProduct(product)
      }
    }
    this.groupProducts();

  }

  //nav
  goStep(step:any) {
    console.log('this.basketValid',this.basketValid)
    console.log('this.addressValid',this.addressValid)
    console.log('this.shippingValid',this.shippingValid)
    console.log('this.paymentValid',this.paymentValid)
    console.log('this.step',this.step)
    //step = this.currentStep$.getValue();
    if (step === 1) {
      this.step = step
      this.updateStep(this.step)
      this.router.navigate(['/cart/shopping-basket']);
    }
    if (step === 2 && this.basketValid) {
      this.step = step
      this.updateStep(this.step)
      this.router.navigate(['/cart/address']);
    }
    if (step === 3 && this.addressValid) {
      this.step = step
      this.updateStep(this.step)
      this.router.navigate(['/cart/shipping']);
    }
    if (step === 4 && this.shippingValid) {
      this.step = step
      this.updateStep(this.step)
      this.router.navigate(['/cart/payment']);
    }
    if (step === 5 && this.paymentValid) {
      this.step = step
      this.updateStep(this.step)
      //this.router.navigate(['/cart/summary']);
    }
  }
  setBasketValid(valid: boolean) {
    this.basketValid = valid;
  }
  setAddressValid(valid: boolean) {
    this.addressValid = valid;
  }
  setShippingValid(valid: boolean) {
    this.shippingValid = valid;
  }
  setPaymentValid(valid: boolean) {
    this.paymentValid = valid;
  }

  destroyCart() {
    this.currentStep$.next(1)
    const newCart = new Cart(); // Crear un nuevo carrito vacío
    this.updateCart(newCart); // Actualizar el carrito con el nuevo carrito vacío
    this.setBasketValid(false);
    this.setAddressValid(false);
    this.setShippingValid(false);
    this.setPaymentValid(false);
  }
}
