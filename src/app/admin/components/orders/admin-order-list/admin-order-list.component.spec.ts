import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderListComponent } from './admin-order-list.component';

describe('AdminOrderListComponent', () => {
  let component: AdminOrderListComponent;
  let fixture: ComponentFixture<AdminOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderListComponent]
    });
    fixture = TestBed.createComponent(AdminOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
