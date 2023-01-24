import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFiltersComponent } from './category-filters.component';

describe('CategoryFiltersComponent', () => {
  let component: CategoryFiltersComponent;
  let fixture: ComponentFixture<CategoryFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
