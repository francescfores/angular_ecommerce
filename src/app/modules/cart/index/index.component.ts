import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {BehaviorSubject} from "rxjs";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {ShippingComponent} from "../pages/shipping/shipping.component";
import {AddressComponent} from "../pages/address/address.component";
import {CartService} from "../services/shared/cart.service";
import {SidebarService} from "../../../components/sidebars/sidebar/services/sidebar.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, AfterViewInit {
  private sidebarOpen: boolean;
  constructor(
    public themeService: ThemeService,
    public sidebarService: SidebarService,
    public router: Router,
    public cartService: CartService,
  ) {}
  isDarkEnable = false;
  presentTheme$ = new BehaviorSubject<string>('theme-light');
  step=1;
  validAddress;
  @ViewChild(AddressComponent) address;

  ngOnInit(): void {
    this.themeService.getCurrentTheme().subscribe(theme => {
      console.log('init this.isDarkEnable')
      this.isDarkEnable = theme === 'theme-dark';
    });
    this.sidebarService.getSidebarState().subscribe(sidebarOpen => {
      this.sidebarOpen = sidebarOpen;
    });
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

  goStep(step) {
    console.log(step)
    this.cartService.goStep(step);
  }

}
