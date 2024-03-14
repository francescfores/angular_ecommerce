import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderGalleryComponent } from './slider-gallery.component';

describe('SliderGalleryComponent', () => {
  let component: SliderGalleryComponent;
  let fixture: ComponentFixture<SliderGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderGalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
