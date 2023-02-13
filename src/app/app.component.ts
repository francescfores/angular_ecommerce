import {AfterViewChecked, Component, OnInit} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent  implements OnInit, AfterViewChecked {
  title = "angular-dashboard-page";

  constructor() { }
  ngOnInit() {
    console.log('init animation')
  }
  ngAfterViewChecked(){
    this.initAnimations();
  }

  initAnimations() {

  }

}
