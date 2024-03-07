import {Component, Input, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MenuItem} from "../models/menu-item";
import {SidebarService} from "../services/sidebar.service";

@Component({
  selector: 'app-submenu-blog',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {

  @Input() icon: string;
  sidebarOpen: boolean;
  @Input() menuItem: MenuItem ;

  dropdownPopoverShow:boolean;
  isDashboardActive:boolean;
  activeRoute:boolean;
  constructor(
    public sidebarService: SidebarService,
    private router: Router
    ) {
    this.isDashboardActive = false;
    this.sidebarOpen = false;
    this.activeRoute = false;
    this.dropdownPopoverShow = false;

    this.icon = '';
    this.menuItem=new MenuItem('Users', 'fas fa-light fa-users','/users','Config', null, null);
  }
  ngOnInit() {
    this.checkActiveRoute()
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute=false;
        console.log('---------------this.activeRoute')
        this.checkActiveRoute()
      }
    });
    this.sidebarService.getSidebarState().subscribe(sidebarOpen => {
      this.sidebarOpen = sidebarOpen;
    });
  }

  checkActiveRoute(){
    this.menuItem.children?.forEach((item) => {
      console.log(this.router.isActive(item.route, true))
      if(this.router.isActive(item.route, true)){
        this.activeRoute=true;
        this.dropdownPopoverShow = true;
      }
    });
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  toggleDropdown() {
    if(!this.sidebarOpen){
      this.toggleSidebar();
      this.dropdownPopoverShow = true;
    }else {
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;

      } else {
        this.dropdownPopoverShow = true;

      }
    }

  }
}
