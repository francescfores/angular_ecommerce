import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-ecommerce-navbar",
  templateUrl: "./ecommerce-navbar.component.html",
})
export class EcommerceNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
