import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupercategoryComponent } from './edit-supercategory.component';

describe('EditSupercategoryComponent', () => {
  let component: EditSupercategoryComponent;
  let fixture: ComponentFixture<EditSupercategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSupercategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSupercategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
