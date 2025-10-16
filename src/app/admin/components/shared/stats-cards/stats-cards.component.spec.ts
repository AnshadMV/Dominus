import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardsComponent } from './stats-cards.component';

describe('StatsCardsComponent', () => {
  let component: StatsCardsComponent;
  let fixture: ComponentFixture<StatsCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsCardsComponent]
    });
    fixture = TestBed.createComponent(StatsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
