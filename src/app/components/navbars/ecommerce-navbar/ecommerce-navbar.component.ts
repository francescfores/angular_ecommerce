import {Component, EventEmitter, HostListener, Input, OnInit, Output} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import * as $ from "jquery";

@Component({
  selector: "app-ecommerce-navbar",
  templateUrl: "./ecommerce-navbar.component.html",
})

@HostListener('window:scroll', ['$event'])
// for window scroll events
export class EcommerceNavbarComponent implements OnInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() isDarkEnable: boolean;
  @Input() transparent = false;


  navbarOpen = false;
  navbarUserOpen = false;
  loginOpen = false;
  presentTheme$ = new BehaviorSubject<string>('theme-light');
  genericHamburgerLine = 'h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300 lg:hidden';
  // @ts-ignore

  constructor() {}
  public changeTheme(isDarkEnable): any {
    return isDarkEnable;
  }

  ngOnInit(): void {
    console.log('this.transparent');
    console.log('this.transparent');
    console.log(this.transparent);
    $('#navbar').removeClass('bg-transparent');
    $('#navbar').addClass('bg-primary');

    if(this.transparent){
      console.log('this.transparent');
      console.log(this.transparent);
      $('#navbar').addClass('bg-transparent');
      $('#navbar').removeClass('bg-primary');
      window.addEventListener('scroll', this.scroll, true)
    }
  }
  scroll = (): void => {
    if(window.scrollY <= 50){
      $('#navbar').addClass('bg-transparent');
      $('#navbar').removeClass('bg-primary');
    }else {
      $('#navbar').removeClass('bg-transparent');
      $('#navbar').addClass('bg-primary');
    }

  }
  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
  setLoginOpen() {
    this.loginOpen = !this.loginOpen;
  }
}

