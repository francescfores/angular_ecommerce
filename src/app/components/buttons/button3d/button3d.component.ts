import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Subscription} from "rxjs";
@Component({
  selector: 'app-button3d',
  templateUrl: './button3d.component.html',
  styleUrls: [
    './button3d.component.css',
    './button3d_theme_default.component.css',
    //  './button3d_theme_rick_morty.component.css',
    // './button3d_theme_futurama.component.css'
  ]
})
export class Button3dComponent implements OnInit{
  button:any;
  @Input() title ='Click';
  @Input() title_loading ='Loading..';
  @Input() title_loading_success ='Succes';
  @Input() height ='30px';
  @Input() width ='';
  @Input() raise =5;
  @Input() rounded ='20px';
  // @Input() rotate ='';
  // @Input() rotate_invers ='';
  @Input() border ='';
  @Input() border_style ='';

  @Input() bg_front_color ='';
  @Input() bg_shadow_color ='';
  @Input() bg_back_color ='';
  @Input() font_color ='';
  @Input() font_body_weight ='';
  @Input() font_size ='';
  // @Input() loading: boolean;
  @Input() loading_type:string ='';//slideInLeft
  @Input() loading:boolean=false;//slideInLeft
  @Input() loading_time:number=500;//slideInLeft
  @Input() type:string='';//slideInLeft
  @Input() ripple = true;

  @ViewChild('btn') btn!: ElementRef<HTMLButtonElement>;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    // this.loading=false;
  }

  //native of angular //when loading change
  ngOnChanges(changes: SimpleChanges): void {

    if(this.loading_type!==''){
      if (changes['loading']) {

        const loading = changes['loading'].currentValue;
        const previousValue = changes['loading'].previousValue;
        if (loading !== previousValue && previousValue !==undefined) {
          // La propiedad 'loading' ha cambiado
          // Puedes realizar acciones aquí cuando se detecte un cambio en 'loading'
          const myButton = this.btn.nativeElement;
          const bubble = myButton.querySelector('.bubble') as HTMLElement;
          const childElement= myButton.querySelector('.btn_loading_wrapp') as HTMLElement;
          let txt_loaded=childElement.querySelector('.txt_loaded') as HTMLElement;
          let txt_loading=childElement.querySelector('.txt_loading') as HTMLElement;
          childElement.classList.remove('hidden');


          if(!loading){
            txt_loaded.classList.remove('hidden');
            txt_loading.classList.add('hidden');
            if (this.loading_type === 'waves') {
              bubble.classList.remove('hidden');
            }

            setTimeout(function() {
              childElement.classList.add('opacity-0');
              childElement.classList.remove('flex','btn_loading_slideInLeft');
            }, 600);
            myButton.style.pointerEvents = "auto";

          }else {
            myButton.style.pointerEvents = "none";

            txt_loaded.classList.add('hidden');

            txt_loading.classList.remove('hidden');
            childElement.classList.remove('opacity-0');
            childElement.classList.add('flex');

            if (this.loading_type === 'waves') {
              bubble.classList.add('flex');
              // Código a ejecutar si loading_type es 'waves'
              const water = myButton.querySelector(".water") as HTMLElement;
              let percent = 0;
              let x = 160;
              const interval = setInterval(() => {
                percent++;
                water.style.transform = 'translate(0, '+ (100 -percent)+'%)';
                if (percent === x) {
                  clearInterval(interval);
                }
              }, 10);
            }
            if (this.loading_type === 'slideInLeft') {
              childElement.classList.add('btn_loading_slideInLeft');
            }
          }
        }
      }
    }
  }

  loadWaves(){}

  // //with rxjs
  // private loadingSubject = new BehaviorSubject<boolean>(false);
  // loading$ = this.loadingSubject.asObservable().pipe(distinctUntilChanged());
  // @Input()
  // set loading(value: boolean) {
  //   console.log('eeeeeee',value);
  //     this.loadingSubject.next(value);
  // }

  ngOnInit(): void {
    // this.loading=false;
    //loading change

    // function handleMouseOut(event) {
    //   // Código para manejar el evento 'mouseout'
    // }

    /*
    const height = 200; // Altura del elemento
    const width = 300; // Ancho del elemento

    // Calcular el ángulo en radianes
    const angleRadians = Math.atan(height / width);

    // Convertir el ángulo a grados
    const angleDegrees = angleRadians * (180 / Math.PI);

    // Ajustar el ángulo a 10 grados
    const adjustedAngleDegrees = 10;

    // Calcular la nueva altura en base al ángulo ajustado
    const newHeight = Math.tan(adjustedAngleDegrees * (Math.PI / 180)) * width;

    console.log("Nueva altura:", newHeight);
     */


  }
  ngAfterViewInit() {
    // this.btn.forEach((btn2) => {
    const btn = this.btn.nativeElement;
    const style = this.btn.nativeElement.style;
    style.setProperty('--height', this.height !== '' ? this.height : '');
    style.setProperty('--width', this.width !== '' ? this.width : '');
    style.setProperty('--rounded', this.rounded !== '' ? this.rounded : '');
    style.setProperty('--border', this.border !== '' ? this.border : '');
    style.setProperty('--border_style', this.border_style !== '' ? this.border_style : '');
    style.setProperty('--bg_front_color', this.bg_front_color !== '' ? this.bg_front_color : '');
    style.setProperty('--bg_shadow_color', this.bg_shadow_color !== '' ? this.bg_shadow_color : '');
    style.setProperty('--bg_back_color', this.bg_back_color !== '' ? this.bg_back_color : '');
    style.setProperty('--font_color', this.font_color !== '' ? this.font_color : '');
    style.setProperty('--font_size', this.font_size !== '' ? this.font_size : '');

    style.setProperty('--raise', this.raise+'px');
    let raise=this.raise;
    if(raise>0){
      btn.addEventListener('mousemove', event => {
        const width = btn.offsetWidth;
        const height = btn.offsetHeight;
        let rotationDegrees = Math.atan((height * (raise + raise)) / (width )) ;
        const btnWidth = btn.offsetWidth;
        const mouseX = event.clientX - btn.getBoundingClientRect().left;
        // @ts-ignore
        style.setProperty('--rotate', rotationDegrees);
        // @ts-ignore
        style.setProperty('--rotate_invers', rotationDegrees * -1);
        let btn_frt=btn.querySelector('.btn_front') as HTMLElement;

        var rotate_Y = -10 * ((mouseX - btnWidth / 2) / (btnWidth / 2));
        if(rotate_Y>2){
          btn.classList.remove('btn_shadow_default', 'btn_shadow_left');
          btn.classList.add('btn_shadow_right');
          btn_frt.classList.remove('btn_front_default', 'btn_front_right')
          btn_frt.classList.add('btn_front_left') ;
        }
        if(rotate_Y>-2 && rotate_Y<2){
          btn.classList.remove('btn_shadow_right', 'btn_shadow_left');
          btn.classList.add('btn_shadow_default');
          btn_frt.classList.remove('btn_front_right', 'btn_front_left');
          btn_frt.classList.add('btn_front_default');
        }
        if(rotate_Y<-2){
          btn.classList.remove('btn_shadow_right', 'btn_shadow_default');
          btn.classList.add('btn_shadow_left');
          btn_frt.classList.remove('btn_front_default', 'btn_front_left');
          btn_frt.classList.add('btn_front_right');
        }
      });

    }else{
      style.setProperty('--bg_shadow_color', 'transparent');
    }
    // });

  }

  /* ripple effect */
  handleButtonClick(event: MouseEvent) {
    if (this.ripple) {
      this.removeRippleEffect();
      const btn = this.elementRef.nativeElement.querySelector('.ripple-button');
      // const btn = this.btn.nativeElement;
      // btn.addClass('ripple-button')
      const circle = this.renderer.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      this.renderer.setStyle(circle, 'width', `${diameter}px`);
      this.renderer.setStyle(circle, 'height', `${diameter}px`);
      this.renderer.setStyle(circle, 'left', `${offsetX - radius}px`);
      this.renderer.setStyle(circle, 'top', `${offsetY - radius}px`);
      this.renderer.addClass(circle, 'ripple');

      this.renderer.appendChild(btn, circle);
    }
  }

  private removeRippleEffect() {
    const btn = this.elementRef.nativeElement.querySelector('.ripple-button');
    const ripple = btn.querySelector('.ripple');
    if (ripple) {
      this.renderer.removeChild(btn, ripple);
    }
  }
}
