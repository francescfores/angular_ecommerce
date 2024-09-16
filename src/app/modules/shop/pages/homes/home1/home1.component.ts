import { Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {  Renderer2 } from '@angular/core';import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.css']
})
export class Home1Component implements OnInit, OnDestroy 

{
  @ViewChild('navigation', { static: true }) navigation: ElementRef;
  @ViewChild('sectionsContainer', { static: true }) sectionsContainer: ElementRef;

  private sections: HTMLElement[];
  private dots: HTMLElement[];
  /*scroll next section  */
  private sectionHeight: number;

  ngOnInit() {
    this.sections = Array.from(this.sectionsContainer.nativeElement.querySelectorAll('.section'));
    this.dots = Array.from(this.navigation.nativeElement.querySelectorAll('.nav-dot'));


    this.setDotStatus(); // Initialize dot status
    window.addEventListener('scroll', this.setDotStatus.bind(this));
    /*scroll next section  */
    this.sectionHeight = window.innerHeight;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.setDotStatus.bind(this));
  }

  @HostListener('click', ['$event'])
  scrollToSection2(event: Event) {
    const target = event.target as HTMLElement;

    if (this.dots.includes(target)) {
      const index = this.dots.indexOf(target);

      window.scrollTo({
        top: window.innerHeight * index,
        behavior: 'smooth',
      });
    }
    
  }

  private removeDotStyles() {
    const isActive = this.navigation.nativeElement.querySelector('.is-active');
    
    if (isActive) {
      isActive.classList.remove('is-active');
    }
  }

  private setDotStatus() {
    const scrollPosition = window.scrollY;
    const halfWindow = window.innerHeight / 2;

    this.sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;

      if (scrollPosition > sectionTop - halfWindow && scrollPosition < sectionTop + halfWindow) {
        this.removeDotStyles();
        this.dots[index].classList.add('is-active');
      }
    });
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent) {

  }




}