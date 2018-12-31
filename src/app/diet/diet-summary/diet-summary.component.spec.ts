import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietSummaryComponent } from './diet-summary.component';

describe('DietSummaryComponent', () => {
  let component: DietSummaryComponent;
  let fixture: ComponentFixture<DietSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
