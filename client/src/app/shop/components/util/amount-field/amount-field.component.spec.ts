import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountFieldComponent } from './amount-field.component';

describe('AmountFieldComponent', () => {
  let component: AmountFieldComponent;
  let fixture: ComponentFixture<AmountFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
