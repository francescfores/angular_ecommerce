import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {ThemeService} from "../../../services/theme.service";
import {BehaviorSubject} from "rxjs";
import {SidebarService} from "../../../components/sidebars/sidebar/services/sidebar.service";
import {Router} from "@angular/router";
import {CartService} from "../../cart/services/shared/cart.service";
import {AddressComponent} from "../../cart/pages/address/address.component";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit {
  private sidebarOpen: boolean;
  constructor(
    public themeService: ThemeService,
    public sidebarService: SidebarService,
    public router: Router,
  ) {}
  isDarkEnable = false;

  ngOnInit(): void {
    this.themeService.getCurrentTheme().subscribe(theme => {
      console.log('init this.isDarkEnable')
      this.isDarkEnable = theme === 'theme-dark';
    });
    this.sidebarService.getSidebarState().subscribe(sidebarOpen => {
      this.sidebarOpen = sidebarOpen;
    });

  }
}
