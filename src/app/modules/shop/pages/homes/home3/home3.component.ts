import { Component, HostListener } from '@angular/core';
@Component({
  selector: 'app-home3',
  templateUrl: './home3.component.html',
  styleUrls: ['./home3.component.css']
})
export class Home3Component {

  // Listener para el evento de scroll
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.applyParallaxEffect();
  }

  applyParallaxEffect() {
    const scrollPosition = window.pageYOffset;

    const background = document.getElementById('background');
    const midground = document.getElementById('midground');
    const foreground = document.getElementById('foreground');

    if (background && midground && foreground) {
      // Ajustamos las velocidades para cada capa de parallax
      background.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Fondo más lento
      midground.style.transform = `translateY(${scrollPosition * 0.3}px)`;  // Capa intermedia
      foreground.style.transform = `translateY(${scrollPosition * 0.1}px)`; // Primer plano
    }
  }
}