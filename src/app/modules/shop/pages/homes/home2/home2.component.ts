import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';import { CommonModule } from '@angular/common'; // Importa CommonModule
@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component {
  private circle: HTMLElement;
  private sectionTop: number;

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.circle = this.elRef.nativeElement.querySelector('.circle');
    this.sectionTop = this.elRef.nativeElement.querySelector('.full-page-section').getBoundingClientRect().top + window.scrollY;
    this.updateCirclePosition();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.updateCirclePosition();
  }

  private updateCirclePosition() {
    const scrollTop = window.scrollY;
    const windowWidth = window.innerWidth;
    const circleWidth = this.circle.offsetWidth;
    
    // Calcula el porcentaje de scroll dentro de la sección
    const scrollPercent = Math.min(1, (scrollTop - this.sectionTop) );
    
    // Calcula la posición final del círculo
    const translateX = Math.max(0, Math.min(windowWidth - circleWidth, windowWidth * scrollPercent));

    // Actualiza la posición del círculo
    this.renderer.setStyle(this.circle, 'transform', `translateX(${translateX}px)`);
    }
  }