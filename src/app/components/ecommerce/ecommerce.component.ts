import { Component, OnInit } from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: "app-ecommerce",
  templateUrl: "./ecommerce.component.html",
})
export class EcommerceComponent implements OnInit {
  constructor() {}
  isDarkEnable = false;
  presentTheme$ = new BehaviorSubject<string>('theme-light');

  ngOnInit(): void {}

    changeTheme(changeTheme: any) {
    const result = changeTheme(this.isDarkEnable);
    console.log('and result is',result);
    this.presentTheme$.value === 'theme-light'
      ? this.presentTheme$.next('theme-dark')
      : this.presentTheme$.next('theme-light');
    console.log('savedTheme');
    console.log(this.presentTheme$.value);
    localStorage.setItem('theme', this.presentTheme$.value);
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme);
    this.isDarkEnable = !this.isDarkEnable;
  }

}
