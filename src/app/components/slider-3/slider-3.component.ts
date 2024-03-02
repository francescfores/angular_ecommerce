import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-slider-blog',
  templateUrl: './slider-3.component.html',
  styleUrls: ['./slider-3.component.css']
})


export class Slider3Component implements OnInit, AfterViewInit{
  @ViewChild('slide') slide!: ElementRef<HTMLElement>;
  intervalId: any;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {


  }
  ngAfterViewInit(){
    const slide = this.slide.nativeElement;

    var slide0 = document.querySelector('.slide-0') as HTMLElement;
    var slide1 = document.querySelector('.slide-1') as HTMLElement;
    var slide2 = document.querySelector('.slide-2') as HTMLElement;
    var slide3 = document.querySelector('.slide-3') as HTMLElement;
    // slide0.classList.add('animate__animated','animate__slideInLeft')

    // Crea una instancia de MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
      console.log('Cambio de opacidad:');

      mutationsList.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const opacity = parseFloat(slide0.style.opacity);
          console.log('Cambio de opacidad:', opacity);

          // Realiza acciones adicionales en función del cambio de opacidad
        }
      });
    });

    // Configura las opciones del observador
    let config = { attributes: true };

    // Inicia la observación del elemento
    observer.observe(slide,
      config);
  // }


    this.intervalId = setInterval(() => {
      const opacity = parseFloat(window.getComputedStyle(slide0).getPropertyValue('opacity'));
      const opacity1 = parseFloat(window.getComputedStyle(slide1).getPropertyValue('opacity'));
      const opacity2 = parseFloat(window.getComputedStyle(slide2).getPropertyValue('opacity'));
      const opacity3 = parseFloat(window.getComputedStyle(slide3).getPropertyValue('opacity'));
      var label = slide0.querySelector('.animation_div_right') as HTMLElement;
      var label1 = slide1.querySelector('.animation_div_left') as HTMLElement;
      var label2 = slide2.querySelector('.animation_div_right') as HTMLElement;
      var label3 = slide3.querySelector('.animation_div_left') as HTMLElement;

      if(opacity<1 ){
        label.classList.remove('animate__animated','animate__slideInLeft')
      }
      if(opacity>0.1){
        label.classList.add('animate__animated','animate__slideInLeft')
      }
      if(opacity1<1 ){
        label1.classList.remove('animate__animated','animate__slideInRight')
      }
      if(opacity1>0.1){
        label1.classList.add('animate__animated','animate__slideInRight')
      }
      if(opacity2<1 ){
        label2.classList.remove('animate__animated','animate__slideInLeft')
      }
      if(opacity2>0.1){
        label2.classList.add('animate__animated','animate__slideInLeft')
      }
      if(opacity3<1 ){
        label3.classList.remove('animate__animated','animate__slideInRight')
      }
      if(opacity3>0.1){
        label3.classList.add('animate__animated','animate__slideInRight')
      }
      // if(opacity1<1){
      //   console.log('Cambio de opacidad:', opacity);
      //   slide1.classList.remove('animate__animated','animate__slideInLeft')
      // }
      // if(opacity1===1){
      //   console.log('Cambio de opacidad:', opacity1);
      //   slide1.classList.add('animate__animated','animate__slideInLeft')
      // }
      // Realiza acciones adicionales en función del cambio de opacidad
    }, 100);
  }
  ngOnInit(): void {

  }
}
