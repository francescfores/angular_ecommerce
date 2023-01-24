import { Component, OnInit } from "@angular/core";
import {ThemeService} from "../../services/theme.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnInit {
  constructor(public themeService: ThemeService) {}
  isDarkEnable = false;
  registerOpen = false;
  presentTheme$ = new BehaviorSubject<string>('theme-light');

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme);
    console.log(savedTheme);
    if (savedTheme) {
      this.presentTheme$.next(savedTheme);
      if(savedTheme==='theme-light') this.isDarkEnable = true;
      else this.isDarkEnable = false;
    }
  }
  toggleTheme() {
    this.isDarkEnable = !this.isDarkEnable;
  }
  register(){
    console.log('register');
    this.registerOpen = !this.registerOpen;
  }
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
