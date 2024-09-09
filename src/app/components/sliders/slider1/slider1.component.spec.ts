import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slider1Component } from './slider1.component';

describe('Slider1Component', () => {
  let component: Slider1Component;
  let fixture: ComponentFixture<Slider1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Slider1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Slider1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
