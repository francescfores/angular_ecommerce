import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-slider-gallery',
  templateUrl: './slider-gallery.component.html',
  styleUrls: ['./slider-gallery.component.css']
})
export class SliderGalleryComponent implements OnInit, OnDestroy {
  @Input() images: string[] = ['./assets/img/SOFAPALET.png', './assets/img/SOFAPALET.png', './assets/img/sofal.png'];
  currentSlideIndex: number = 0;
  autoplay: boolean = true;
  autoplayInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.startAutoplay();
  }
  ngOnDestroy(): void {
    this.stopAutoplay();
  }
  next() {
    console.log('ne')
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  prev() {
    console.log('prev')
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.images.length) % this.images.length;
  }

  isCurrentSlide(index: number): boolean {
    return this.currentSlideIndex === index;
  }
  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }
  startAutoplay() {
    if (this.autoplay) {
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, 3000); // Cambia cada 3 segundos, ajusta según lo deseado
    }
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }
}
