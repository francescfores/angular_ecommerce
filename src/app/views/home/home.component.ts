import {Component, ElementRef, HostListener} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isDarkEnable = false;
  presentTheme$ = new BehaviorSubject<string>('theme-light');

  //animation
  private el: HTMLElement;
  constructor(private elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  public isVisible: { [key: number]: boolean } = {};

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    let elements = this.elementRef.nativeElement.querySelectorAll('.my-element');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const elementPosition = element.getBoundingClientRect().top;
      const elementHeight = element.offsetHeight;
      const scrollPosition = window.pageYOffset;

      if (elementPosition <= scrollPosition - window.innerHeight - elementHeight / 2 && !this.isVisible[i]) {
        this.isVisible[i] = true;
        console.log('isVisible true')
      } else if (elementPosition > scrollPosition - window.innerHeight - elementHeight / 2 && this.isVisible[i]) {
        this.isVisible[i] = false;
        console.log('isVisible false')
      }
    }
  }

  //
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
  animateElement() {
    const element = document.querySelector('.animate__animated');
    if(element.classList.contains('animate__fadeOut')){
      element.classList.remove('animate__fadeOut');
    }else{
      element.classList.add('animate__fadeOut');
    }
  }

  }



