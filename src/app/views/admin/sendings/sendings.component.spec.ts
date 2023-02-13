import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendingsComponent } from './sendings.component';

describe('SendingsComponent', () => {
  let component: SendingsComponent;
  let fixture: ComponentFixture<SendingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
