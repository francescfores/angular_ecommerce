import {Component, Input, OnInit} from '@angular/core';
import {SidebarService} from'./services/sidebar.service';
import {MenuItem} from "./models/menu-item";
import {ThemeService} from '../../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
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
