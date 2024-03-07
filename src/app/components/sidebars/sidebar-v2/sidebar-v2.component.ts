import {Component, OnInit} from '@angular/core';
import {SidebarService} from "../../sidebars/sidebar/services/sidebar.service";
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-sidebar-v2',
  templateUrl: './sidebar-v2.component.html',
  styleUrls: ['./sidebar-v2.component.css']
})
export class SidebarV2Component implements OnInit{
  sidebarOpen= false;
  isDarkEnable=false;

  constructor(
    public sidebarService: SidebarService,
    public themeService: ThemeService,

  ) {
    this.sidebarOpen= false;
  }

  ngOnInit() {
    this.sidebarService.getSidebarState().subscribe(sidebarOpen => {
      this.sidebarOpen = sidebarOpen;
    });
    this.themeService.getCurrentTheme().subscribe(theme => {
      this.isDarkEnable = theme === 'theme-dark';
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

}
