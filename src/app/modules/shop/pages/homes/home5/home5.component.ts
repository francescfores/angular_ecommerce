import { Component, ElementRef, AfterViewInit, HostListener, Renderer2, ViewChild} from '@angular/core';
import animations from '@midudev/tailwind-animations';
@Component({
  selector: 'app-home5',
  templateUrl: './home5.component.html',
  styleUrls: ['./home5.component.css']
})
export class Home5Component implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  section_animate_video : HTMLElement;
  targetDiv : HTMLElement;
  circle : HTMLElement;
  video : HTMLElement;

  targetDiv2 : HTMLElement;
  circle2 : HTMLElement;

  section2:HTMLElement;
  section2_div:HTMLElement;
  section2_div2:HTMLElement;
  section2_div3:HTMLElement;

  section3:HTMLElement;
  section3_div1:HTMLElement;
  section3_div2:HTMLElement;
  section3_div3:HTMLElement;
  section3_div4:HTMLElement;

  section4:HTMLElement;
  section4_div1:HTMLElement;

  section5:HTMLElement;
  section5_div1:HTMLElement;

  section6:HTMLElement;
  section6_div1:HTMLElement;
  section6_div2:HTMLElement;


  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  isDown = false;
  startX = 0;
  scrollLeft = 0;
  lastMoveTime = 10;
  lastMoveX = 0;
  velocity = 0;
  

  ngAfterViewInit() {
    this.section_animate_video = this.el.nativeElement.querySelector('.section_animate_video');
    this.video = this.el.nativeElement.querySelector('.section_animate_video video');


    this.targetDiv = this.el.nativeElement.querySelector('.section2');
    this.circle = this.el.nativeElement.querySelector('.circle');

    this.targetDiv2 = this.el.nativeElement.querySelector('.section3');
    this.circle2 = this.el.nativeElement.querySelector('.section3 .circle2');

    this.section2 = this.el.nativeElement.querySelector('.section2_animation');
    this.section2_div = this.el.nativeElement.querySelector('.section2_animation .div1');
    this.section2_div2 = this.el.nativeElement.querySelector('.section2_animation .div2');
    this.section2_div3 = this.el.nativeElement.querySelector('.section2_animation .div3');
   
    this.section3 = this.el.nativeElement.querySelector('.section3_animation');
    this.section3_div1 = this.el.nativeElement.querySelector('.section3_animation .div1');
    this.section3_div2 = this.el.nativeElement.querySelector('.section3_animation .div2');
    this.section3_div3 = this.el.nativeElement.querySelector('.section3_animation .div3');
    this.section3_div4 = this.el.nativeElement.querySelector('.section3_animation .div4');

    this.section4 = this.el.nativeElement.querySelector('.section4_animation');
    this.section4_div1 = this.el.nativeElement.querySelector('.section4_animation .div1');

    this.section5 = this.el.nativeElement.querySelector('.section5');
    this.section5_div1 = this.el.nativeElement.querySelector('.section5 .div1');


    this.section6 = this.el.nativeElement.querySelector('.section6');
    this.section6_div1 = this.el.nativeElement.querySelector('.section6 .div1');
    this.section6_div2 = this.el.nativeElement.querySelector('.section6 .div2');

    this.animationDiv()
    

    const container = this.scrollContainer.nativeElement;
    
    container.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDown = true;
      this.startX = e.pageX - container.offsetLeft;
      this.scrollLeft = container.scrollLeft;

      this.lastMoveTime = Date.now();
      this.lastMoveX = e.pageX;
      this.velocity = 0;
    });

    container.addEventListener('mouseleave', () => {
      this.isDown = false;
      this.applyInertia();
    });

    container.addEventListener('mouseup', () => {
      this.isDown = false;
      this.applyInertia();
    });

    container.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDown) return;
      e.preventDefault();

      const x = e.pageX - container.offsetLeft;
      const walk = x - this.startX;
      container.scrollLeft = this.scrollLeft - walk;

      const currentTime = Date.now();
      const timeDiff = currentTime - this.lastMoveTime;
      const distance = e.pageX - this.lastMoveX;
      this.velocity = distance / timeDiff;

      this.lastMoveTime = currentTime;
      this.lastMoveX = e.pageX;
    });
  }
  applyInertia() {
    const container = this.scrollContainer.nativeElement;

    if (Math.abs(this.velocity) > 0.1) {
      const friction = 0.98;
      const inertiaScroll = () => {
        container.scrollLeft -= this.velocity * 30;
        this.velocity *= friction;
        if (Math.abs(this.velocity) > 0.1) {
          requestAnimationFrame(inertiaScroll);
        }
      };
      inertiaScroll();
    }
  }
  
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.animationDiv()
    this.animationDiv2()
    this.animationDiv3()
    this.animationDiv4()
    this.animationDiv5()
    this.animationDiv6()
    this.animationTest1()
    this.animationTest2()

  }
  animationDiv(){
    const visibilityPercentage = 0; // 50% de visibilidad
    const targetDivRect = this.section_animate_video.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const targetDivWidth = targetDivRect.width; // Añadimos la anchura del targetDiv
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const circleHeight = this.circle2.offsetHeight; // Cambiar a offsetHeight para el círculo
    const speed = 0.02;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
    // Verificar visibilidad del targetDiv (dentro del viewport)
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) 
    && targetDivRect.bottom > requiredVisibilityHeight;
          // Calcular la distancia visible

    if (isVisible) {
      this.renderer.setStyle(this.video, 'transform', `translate3d(0px, 0rem, 0px) scale3d(1, 1, 1) 
        rotateX(${targetDivRect.top*speed}deg) rotateY(0deg) rotateZ(0deg) skew(0deg)`);
        this.section_animate_video.classList.add('animate-fade-in-up')
    } else {
      // Resetear la posición del círculo cuando el targetDiv no cumpla con el porcentaje de visibilidad
      this.section_animate_video.classList.remove('animate-fade-in-up')
     }
   }
   animationDiv2() {
    const visibilityPercentage = -0.1; // 50% de visibilidad
    const targetDivRect = this.section2.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const targetDivWidth = targetDivRect.width; // Añadimos la anchura del targetDiv
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const circleHeight = this.circle2.offsetHeight; // Cambiar a offsetHeight para el círculo
    const speed = -0.10;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
    // Verificar visibilidad del targetDiv (dentro del viewport)
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) 
    && targetDivRect.bottom > requiredVisibilityHeight;
    if (isVisible) {
      // Calcular la distancia visible
      const distance = Math.max(0, viewportHeight - targetDivRect.top - requiredVisibilityHeight);
      // Calcular la proporción visible en el eje vertical
      const proportionY = distance / (viewportHeight - requiredVisibilityHeight);
      // Calcular la posición Y proporcional al ancho del targetDiv
      const positionY = proportionY * (viewportHeight - circleHeight) * speed;
      // Aplicar el movimiento en el eje Y
/*       this.renderer.setStyle(this.section2, 'transform', `translateY(${positionY}px)`);
 */      this.renderer.setStyle(this.section2_div, 'transform', `translateY(${positionY*0.8}px)`);
      this.renderer.setStyle(this.section2_div2, 'transform', `translateY(${(positionY*0.1)}px)`);
      this.renderer.setStyle(this.section2_div3, 'transform', `translateY(${positionY*0.8}px)`);
      this.section2.classList.add('animate-fade-in-up')

    } else {
      this.section2.classList.remove('animate-fade-in-up')
      // Mover el círculo fuera del viewport si no es visible
    }
  }
  animationDiv3() {
    const visibilityPercentage = 0; // 50% de visibilidad
    const targetDivRect = this.section3.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const circleWidth = this.section3_div1.offsetWidth;
    const speed = 0.05;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
  
    // Verificar visibilidad del targetDiv (dentro del viewport)
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) && targetDivRect.bottom > requiredVisibilityHeight;
  
    if (isVisible) {
      // Calcular la distancia visible
      const distance = Math.max(0, viewportHeight - targetDivRect.top - requiredVisibilityHeight);
  
      // Calcular la proporción visible
      const proportion = distance / (viewportHeight - requiredVisibilityHeight);
  
      // Mover el círculo proporcionalmente al ancho del viewport
      const positionX = proportion * (viewportWidth - circleWidth) * speed;
  
      // Aplicar el movimiento
      this.renderer.setStyle(this.section3_div1, 'transform', `translateX(${-positionX}px)`);
      this.renderer.setStyle(this.section3_div2, 'transform', `translateX(${positionX}px)`);
      this.renderer.setStyle(this.section3_div3, 'transform', `translateX(${-positionX}px)`);
      this.renderer.setStyle(this.section3_div4, 'transform', `translateX(${positionX}px)`);
    } else {

/*       this.renderer.setStyle(this.section3_div, 'transform', `translateX(${viewportWidth + circleWidth}px)`);
 */      // Mover el círculo fuera del viewport si no es visible
    }
  }
  animationDiv4() {
    const visibilityPercentage = 0; // 10% de visibilidad
    const targetDivRect = this.section4.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const viewportHeight = window.innerHeight;
    const speed = 1;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
    
    // Verificar si el div está visible en el viewport
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) 
                      && targetDivRect.bottom > requiredVisibilityHeight;
  
    if (isVisible) {
      // Calcular la distancia visible desde la parte superior del viewport
      const distance = Math.max(0, viewportHeight - targetDivRect.top);
      // Proporción de visibilidad
      const proportionY = Math.min(1, distance / (viewportHeight - requiredVisibilityHeight)); // Limitar entre 0 y 1
  
      // Posición Y y escala basadas en la proporción de visibilidad
      const positionY = proportionY * viewportHeight * speed;
      const scaleValue = Math.max(0, 2 - proportionY ); // Escala de 2 a 0
/*       const scaleValue = Math.max(0, 2 - proportionY * 2); // Escala de 2 a 0
 */      // Aplicar el movimiento y la escala
      this.renderer.setStyle(this.section4_div1, 'transform', ` scale(${scaleValue})`);
      this.section4.classList.add('animate-fade-in')

    } else {
      this.section4.classList.remove('animate-fade-in')

      // Si no está visible, resetear la posición y la escala (si es necesario)
/*       this.renderer.setStyle(this.section4_div1, 'transform', `translateY(0px) scale(2)`);
 */    }
    
  }
  animationDiv5() {
    const visibilityPercentage = 0.1; // 10% de visibilidad
    const targetDivRect = this.section5.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const viewportHeight = window.innerHeight;
    const speed = 1;
  
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) 
                      && targetDivRect.bottom > requiredVisibilityHeight;
    if (isVisible) {
      const distance = Math.max(0, viewportHeight - targetDivRect.top);
      const proportionY = Math.min(1, distance / (viewportHeight - requiredVisibilityHeight)); // Limitar entre 0 y 1
  
      const positionY = proportionY * viewportHeight * speed;
      const scaleValue = Math.max(0, 2 - proportionY ); // Escala de 2 a 0
      this.renderer.setStyle(this.section5, 'transform', `positionY(${positionY}px)`);
      this.section5_div1.classList.add('animate-fade-in-left')

    } else {
      this.section5_div1.classList.remove('animate-fade-in-left')
 }
    
  }
  animationDiv6() {
    const visibilityPercentage = -0.1; // 50% de visibilidad
    const targetDivRect = this.section6.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const viewportHeight = window.innerHeight;
    const speed = 0.001;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
    // Verificar visibilidad del targetDiv (dentro del viewport)
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) 
    && targetDivRect.bottom > requiredVisibilityHeight;
          // Calcular la distancia visible

    if (isVisible) {
     
        this.renderer.setStyle(this.section6_div1, 'opacity', `${targetDivRect.bottom*speed}`);
      } else {
/*         this.renderer.setStyle(this.section6_div1, 'opacity', `${1}`);
 */     }
    
  }
   animationTest1() {
    const visibilityPercentage = 0.50; // 50% de visibilidad
    const targetDivRect = this.targetDiv.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const circleWidth = this.circle.offsetWidth;
    const speed = 1;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
  
    // Verificar visibilidad del targetDiv (dentro del viewport)
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) && targetDivRect.bottom > requiredVisibilityHeight;
  
    if (isVisible) {
      // Calcular la distancia visible
      const distance = Math.max(0, viewportHeight - targetDivRect.top - requiredVisibilityHeight);
  
      // Calcular la proporción visible
      const proportion = distance / (viewportHeight - requiredVisibilityHeight);
  
      // Mover el círculo proporcionalmente al ancho del viewport
      const positionX = proportion * (viewportWidth - circleWidth) * speed;
  
      // Aplicar el movimiento
      this.renderer.setStyle(this.circle, 'transform', `translateX(${positionX}px)`);
    } else {
      // Mover el círculo fuera del viewport si no es visible
      this.renderer.setStyle(this.circle, 'transform', `translateX(${viewportWidth + circleWidth}px)`);
    }
  }
  animationTest2() {
    const visibilityPercentage = 0.50; // 50% de visibilidad
    const targetDivRect = this.targetDiv2.getBoundingClientRect();
    const targetDivHeight = targetDivRect.height;
    const targetDivWidth = targetDivRect.width; // Añadimos la anchura del targetDiv
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const circleHeight = this.circle2.offsetHeight; // Cambiar a offsetHeight para el círculo
    const speed = 1;
  
    // Calcular la altura visible requerida
    const requiredVisibilityHeight = targetDivHeight * visibilityPercentage;
    // Verificar visibilidad del targetDiv (dentro del viewport)
    const isVisible = targetDivRect.top < (viewportHeight - requiredVisibilityHeight) 
    && targetDivRect.bottom > requiredVisibilityHeight;
    if (isVisible) {
      // Calcular la distancia visible
      const distance = Math.max(0, viewportHeight - targetDivRect.top - requiredVisibilityHeight);
      // Calcular la proporción visible en el eje vertical
      const proportionY = distance / (viewportHeight - requiredVisibilityHeight);
      // Calcular la posición Y proporcional al ancho del targetDiv
      const positionY = proportionY * (viewportHeight - circleHeight) * speed;
      // Aplicar el movimiento en el eje Y
      this.renderer.setStyle(this.circle2, 'transform', `translateY(${positionY}px)`);
    } else {
      // Mover el círculo fuera del viewport si no es visible
      this.renderer.setStyle(this.circle2, 'transform', `translateY(${0}px)`);
    }
  }
  
}
/* console.log('top '+ (this.targetDiv.getBoundingClientRect().top -this.targetDiv.getBoundingClientRect().height ) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().top -(this.targetDiv.getBoundingClientRect().height*0.75 )) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().top -(this.targetDiv.getBoundingClientRect().height*0.50 )) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().top -(this.targetDiv.getBoundingClientRect().height*0.25 )) )
console.error('top '+ (this.targetDiv.getBoundingClientRect().top ) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().bottom - this.targetDiv.getBoundingClientRect().height) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().bottom - (this.targetDiv.getBoundingClientRect().height*0.75)) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().bottom - (this.targetDiv.getBoundingClientRect().height*0.5)) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().bottom - (this.targetDiv.getBoundingClientRect().height*0.25)) )
console.log('top '+ (this.targetDiv.getBoundingClientRect().bottom ) )
 */
