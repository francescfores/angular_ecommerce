import {animate, animation, keyframes, style} from "@angular/animations";

export const fadeInOut = animation([
  animate('{{duration}}', keyframes([
    style({opacity: 0, offset: 0}),
    style({opacity: 1, offset: 1}),
  ]))
]);
