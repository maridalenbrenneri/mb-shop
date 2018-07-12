import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCustomerDetailsComponent } from './checkout-customer-details.component';

describe('CheckoutCustomerDetailsComponent', () => {
  let component: CheckoutCustomerDetailsComponent;
  let fixture: ComponentFixture<CheckoutCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
