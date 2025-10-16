import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductCategoriesComponent } from './admin-product-categories.component';

describe('AdminProductCategoriesComponent', () => {
  let component: AdminProductCategoriesComponent;
  let fixture: ComponentFixture<AdminProductCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProductCategoriesComponent]
    });
    fixture = TestBed.createComponent(AdminProductCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
