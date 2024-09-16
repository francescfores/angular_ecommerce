import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "../models/menu-item";
import {SidebarService} from "../services/sidebar.service";
import {CategoryService} from "../../../../services/api/category.service";

@Component({
  selector: 'app-menu-blog',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  sidebarOpen= false;
  menuItems: MenuItem[] ;
  shownGroups: string[] = [];
  private categories: any;

  getCategories(){
    this.categoryService.getCategories()
      .subscribe({
        next: res => {
          this.categories= res.data.category;
          console.log(this.categories)
          for (const cat of this.categories) {
            console.log(cat)
              this.menuItems.push( new MenuItem(cat.name, '',
                '/'+cat.name,'', 'text-textPrimary text-4xl font-semibold',false, null));
            console.log(this.menuItems)

            for (const subcat of cat.subcategories) {
              console.log(subcat)
              console.log(cat.name)
             let item= this.menuItems.find(x=> x.label===cat.name);
              console.log(item)
              if(item.children===null){
                item.children=[];
              }
              item.children.push(new MenuItem(subcat.name, 'fas fa-light fa-users',
                '/'+subcat.name,'', 'pt-0',false, null))

              for (const supercat of subcat.supercategories) {
                console.log(supercat)
                let item2= item.children.find(x=> x.label===subcat.name);
                if(item2.children===null){
                  item2.children=[];
                }
                item2.children.push(new MenuItem(supercat.name, 'fas fa-light fa-users',
                  '/'+supercat.name,'', 'pt-0',false, null))

              }
            }
          }
        },
        error: (err: any) => { },
        complete: () => { }
      });
  }

  constructor(
    public sidebarService: SidebarService,
    private categoryService: CategoryService,
  ) {
    // load menu from categories
    this.getCategories();

    this.menuItems=[
      new MenuItem('Home', 'fas fa-light fa-users','/home','', 'font-bold text-4xl',false, null),
      new MenuItem('Contacto', 'fas fa-light fa-users','/contact','', 'pt-0',false, null),
      new MenuItem('Productos', 'fas fa-light fa-users','/products','', 'pt-0',false, null),

      // new MenuItem('Dashboard', 'fas fa-light fa-chart-pie','/admin/dashboard','Admin Layouts','pt-2 border-t border-dashed border-bgTern',false,[
      //   new MenuItem('Dashboard', null,'/admin/dashboard','Base','pt-0',false,null),
      //   new MenuItem('Analytics', null,'/admin/charts','Base','pt-0',false,null),
      // ]),
      // new MenuItem('Landings', 'fas fa-light fa-code','/front/landings/','widgets','pt-1',null,[
      //   new MenuItem('Landings', null,'/front/landings/landings',null,'pt-0',false,null),
      //   new MenuItem('Landing1', null,'/front/landings/landing1',null,'pt-0',false,null),
      //   new MenuItem('Landing2', null,'/front/landings/landing2',null,'pt-0',false,null),
      // ]),
      // new MenuItem('Users', 'fas fa-light fa-users','/admin/users','', 'pt-1',false, null),
      // new MenuItem('Notification', 'fas fa-light fa-bell','/admin/notification','','pt-1 border-bgTern', true, null),
      //
      // new MenuItem('Components', 'fas fa-light fa-code','/admin/components/','widgets','pt-1',null,[
      //   new MenuItem('Alerts', null,'/admin/components/alerts',null,'pt-0',false,null),
      //   new MenuItem('Badge', null,'/admin/components/badge',null,'pt-0',false,null),
      //   new MenuItem('Buttons', null,'/admin/components/buttons',null,'pt-0',false,null),
      //   new MenuItem('Buttons3d', null,'/admin/components/buttons3d',null,'pt-0',false,null),
      //   new MenuItem('Cards', null,'/admin/components/cards',null,'pt-0',false,null),
      //   new MenuItem('Dropdowns', null,'/admin/components/dropdowns',null,'pt-0',false,null),
      //   new MenuItem('Images', null,'/admin/components/images',null,'pt-0',false,null),
      //   new MenuItem('Inputs', null,'/admin/components/inputs',null,'pt-0',false,null),
      //   new MenuItem('Menus', null,'/admin/components/menus',null,'pt-0',false,null),
      //   new MenuItem('Modals', null,'/admin/components/modals',null,'pt-0',false,null),
      //   new MenuItem('Navbars', null,'/admin/components/navbars',null,'pt-0',false,null),
      //   new MenuItem('Pagination', null,'/admin/components/pagination',null,'pt-0',false,null),
      //   new MenuItem('Popovers', null,'/admin/components/popovers',null,'pt-0',false,null),
      //   new MenuItem('Progressbars', null,'/admin/components/progressbars',null,'pt-0',false,null),
      //   new MenuItem('Tabs', null,'/admin/components/tabs',null,'pt-0',false,null),
      //   new MenuItem('Tooltips', null,'/admin/components/tooltips',null,'pt-0',false,null),
      // ]),
      // new MenuItem('Pages', 'fas fa-light fa-file','pages','Layouts','pt-1',null,[
      //   new MenuItem('About Us', null,'/about-us',null,'pt-0',false,null),
      //   new MenuItem('Contact', null,'/contact',null,'pt-0',false,null),
      // ]),
      // // new MenuItem('Auth', 'fas fa-light fa-lock','pages','Auth Layouts','pt-2  border-b border-dashed border-bgTern',false,[
      // new MenuItem('Auth', 'fas fa-light fa-lock','pages','Auth Layouts','pt-1',false,[
      //   new MenuItem('Signin', null,'/auth/sign-in',null,'pt-0',false,null),
      //   new MenuItem('Signup', null,'/auth/sign-up',null,'pt-0',false,null),
      //   new MenuItem('Signup', null,'/auth/sign-up',null,'pt-0',false,null),
      //   new MenuItem('Forgot Password', null,'/auth/sign-up',null,'pt-0',false,null),
      //   new MenuItem('New Password', null,'/auth/sign-up',null,'pt-0',false,null),
      //   new MenuItem('Two Steps', null,'/auth/sign-up',null,'pt-0',false,null),
      // ]),
    ]
  }
  ngOnInit() {
    this.sidebarService.getSidebarState().subscribe(sidebarOpen => {
      this.sidebarOpen = sidebarOpen;
    });
    for (const menuItem of this.menuItems) {
      if (menuItem.group && !this.shownGroups.includes(menuItem.group)) {
        // this.shownGroups.push(menuItem.group);
      }
    }
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
