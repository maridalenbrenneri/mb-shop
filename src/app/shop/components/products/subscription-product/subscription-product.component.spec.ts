import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionProductComponent } from './subscription-product.component';

describe('SubscriptionProductComponent', () => {
  let component: SubscriptionProductComponent;
  let fixture: ComponentFixture<SubscriptionProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
