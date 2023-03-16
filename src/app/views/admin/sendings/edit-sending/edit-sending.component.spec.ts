import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSendingComponent } from './edit-sending.component';

describe('EditSendingComponent', () => {
  let component: EditSendingComponent;
  let fixture: ComponentFixture<EditSendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
