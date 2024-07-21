import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
// import {ThemeService} from "../../../../services/theme/theme.service";
import {first} from "rxjs/operators";
import {environment} from '../../../../../environments/environment';
import {ThemeService} from "../../../../services/theme.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{

  isDarkEnable = false;
  sidebarOpen= false;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    // private toastr: ToastrService,
    public themeService: ThemeService,
  ) {
  }

  animations: { element: HTMLElement, animationClasses: string[] }[] = [];
  animationClasses: string[][] = [
    ['-translate-x-full', 'opacity-0'],
    ['translate-x-full', 'opacity-0'],
    ['-translate-x-full', 'opacity-0'],
    ['translate-x-full','opacity-0'],
    ['-translate-x-full','opacity-0'],
    ['translate-x-full','opacity-0'],
    ['-translate-x-full','opacity-0']
  ];
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const windowCenter = window.innerHeight / 1.6;

    for (const animation of this.animations) {
      const elementRect = animation.element.getBoundingClientRect();

      if (elementRect.top  <= windowCenter && elementRect.bottom + 400  >= windowCenter) {
        animation.element.classList.remove(...animation.animationClasses);
      } else {
        animation.element.classList.add(...animation.animationClasses);
      }
    }
  }
  ngAfterViewInit() {
    // let sliderContainer = document.getElementById('sliderContainer') as HTMLElement;
    // const sliderItems = sliderContainer.getElementsByClassName('slider-item') as HTMLCollectionOf<HTMLElement>;
    //
    // // Agregar evento de scroll suave a cada elemento del slider
    // Array.from(sliderItems).forEach((item) => {
    //   item.addEventListener('click', () => {
    //     const itemOffsetLeft = item.offsetLeft;
    //     const containerScrollLeft = sliderContainer.scrollLeft;
    //     const containerWidth = sliderContainer.offsetWidth;
    //
    //     const scrollLeft = itemOffsetLeft - (containerWidth - item.offsetWidth) / 2;
    //     const scrollDuration = 500; // Duración del desplazamiento en milisegundos
    //
    //     this.smoothScrollTo(sliderContainer, scrollLeft, scrollDuration);
    //   });
    // });
    //
    // let currentIndex = 0;
    // const scrollDuration = 5000; // Duración del desplazamiento automático en milisegundos




    // Función para realizar el desplazamiento automático
    // const autoScroll = () => {
    //   const containerWidth = sliderContainer.offsetWidth;
    //   const itemWidth = sliderItems[currentIndex].offsetWidth;
    //
    //   const scrollLeft = sliderItems[currentIndex].offsetLeft - (containerWidth - itemWidth) / 2;
    //
    //   this.smoothScrollTo(sliderContainer, scrollLeft, scrollDuration);
    //
    //   currentIndex = (currentIndex + 1) % sliderItems.length;
    // };

    // Iniciar el desplazamiento automático
    // let interval = setInterval(autoScroll, scrollDuration);

    // Detener el desplazamiento automático al hacer hover en el slider
    // sliderContainer.addEventListener('mouseenter', () => {
    //   clearInterval(interval);
    // });
    //
    // // Reanudar el desplazamiento automático al salir del hover en el slider
    // sliderContainer.addEventListener('mouseleave', () => {
    //   interval = setInterval(autoScroll, scrollDuration);
    // });
  }

  // Función para realizar el desplazamiento suave
  smoothScrollTo(element: HTMLElement, scrollLeft: number, duration: number) {
    const start = element.scrollLeft;
    const change = scrollLeft - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      const newScrollLeft = easeInOutQuad(currentTime, start, change, duration);
      element.scrollLeft = newScrollLeft;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    const easeInOutQuad = (t:number, b:number, c:number, d:number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    animateScroll();
  }

  ngOnInit() {
    const elements = Array.from(document.getElementsByClassName('on_view'));

    for (let i = 0; i < elements.length; i++) {
      let animationClasses = this.animationClasses[i % this.animationClasses.length];
      this.animations.push({ element: elements[i] as HTMLElement, animationClasses });
    }
    this.themeService.getCurrentTheme().subscribe(theme => {
      this.isDarkEnable = theme === 'theme-dark';
    });
  }


}


