import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home4',
  templateUrl: './home4.component.html',
  styleUrls: ['./home4.component.css']
})
export class Home4Component implements AfterViewInit {
  
  @ViewChild('mySwiper') swiperEl!: ElementRef;
  intervalId: any;

  constructor() {}

  ngAfterViewInit() {
    const swiperElement = this.swiperEl.nativeElement;

    var swiperEl = document.querySelector(".mySwiper");
    Object.assign(swiperElement, {
      grabCursor: true,
      effect: "creative",
      creativeEffect: {
        prev: {
          translate: ["0", 0, 0],
        },
        next: {
          translate: [0, "100%", 0],
        },
      },
    });
    swiperElement.initialize()
    
    swiperEl.addEventListener('swiperslidechange', (event:any) => {
      const [swiper, progress] = event.detail;
      console.log(swiper.realIndex)
      var slide1 = document.querySelector('.slide-1') as HTMLElement;
      var label = slide1.querySelector('.animation_div_right') as HTMLElement;

      if(swiper.realIndex!==1 ){
        label.classList.remove('animate__animated','animate__slideInLeft')
        label.classList.add('opacity-1')
      }
      if(swiper.realIndex==1){
        label.classList.add('animate__animated','animate__slideInLeft')
        label.classList.remove('opacity-0')
      }
    });
/*   swiperEl.addEventListener('swiperslidechange', (event:any) => {
    console.log('slide changed');
    console.log(event.detail[0]['activeIndex']);
  }); */

    
  }
  
}