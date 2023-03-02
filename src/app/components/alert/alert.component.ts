import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnChanges{
  @Input() text='test';
  @Input() color='info'; // danger/info/warning/success
  @Input() autocloseTime:number;
  @Input() show=false;
  closed=true;

  @Output() showChange = new EventEmitter<boolean>();

  ngOnChanges(){
    if(this.show){
      this.closed = false;

      setTimeout(() => {
        this.closed = true;
        this.show=false;
        this.toggleShow();
      }, this.autocloseTime);
    }
  }

  toggleShow() {
    //this.show = !this.show;
    this.showChange.emit(this.show);
  }

  ngOnInit(){
  }
  close() {
    this.closed=true;
  }
}
