import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import * as $ from 'jquery'

@Component({
  selector: "app-default-navbar",
  templateUrl: "./default-navbar.component.html",
})
@HostListener('window:scroll', ['$event']) // for window scroll events

export class DefaultNavbarComponent implements OnInit, OnDestroy {
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() isDarkEnable: boolean;


  navbarOpen = false;
  loginOpen = false;
  presentTheme$ = new BehaviorSubject<string>('theme-light');
  genericHamburgerLine = 'h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300 lg:hidden';
  // @ts-ignore

  constructor() {}
  public changeTheme(isDarkEnable): any {
    return isDarkEnable;
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true)

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
  ngOnDestroy(){
    window.removeEventListener('scroll', this.scroll, true)
  }

  onScroll($event: Event) {
    console.log('scroll');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {

      document.getElementById("navbar").style.background = "#501e27";
    } else {

      document.getElementById("navbar").style.background = "none";
    }
  }


}
