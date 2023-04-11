import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {BehaviorSubject} from "rxjs";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ShippingComponent} from "../pages/shipping/shipping.component";
import {AddressComponent} from "../pages/address/address.component";
import {CartService} from "../services/shared/cart.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, AfterViewInit {
  constructor(
    public themeService: ThemeService,
    public router: Router,
    public cartService: CartService,
  ) {}
  isDarkEnable = true;
  presentTheme$ = new BehaviorSubject<string>('theme-light');
  step=1;
  validAddress;
  @ViewChild(AddressComponent) address;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.presentTheme$.next(savedTheme);
      if(savedTheme==='theme-light') this.isDarkEnable = true;
      else this.isDarkEnable = false;
    }
    this.cartService.currentStep.subscribe((step) => {
        console.log(step);
        this.step = step;
    });
  }

  ngAfterViewInit() {
  }

  toggleTheme() {
    this.isDarkEnable = !this.isDarkEnable;
  }
  changeTheme(changeTheme: any) {
    const result = changeTheme(this.isDarkEnable);
    console.log('and result is',result);
    this.presentTheme$.value === 'theme-light'
      ? this.presentTheme$.next('theme-dark')
      : this.presentTheme$.next('theme-light');
    localStorage.setItem('theme', this.presentTheme$.value);
    const savedTheme = localStorage.getItem('theme');
    this.isDarkEnable = !this.isDarkEnable;
  }

  goStep(step) {
    console.log(step)
    this.cartService.goStep(step);
  }

}
