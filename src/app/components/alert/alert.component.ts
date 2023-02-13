import {Component, Input, OnChanges, OnInit} from '@angular/core';

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
  ngOnChanges(){
    if(this.show){
      this.closed = false;
      setTimeout(() => {
        this.closed = true;
      }, this.autocloseTime);
    }
  }
  ngOnInit(){
  }
  close() {
    this.closed=true;
  }
}
