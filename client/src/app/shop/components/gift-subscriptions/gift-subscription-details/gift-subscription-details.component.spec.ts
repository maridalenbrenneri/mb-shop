import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftSubscriptionDetailsComponent } from './gift-subscription-details.component';

describe('GiftSubscriptionDetailsComponent', () => {
  let component: GiftSubscriptionDetailsComponent;
  let fixture: ComponentFixture<GiftSubscriptionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftSubscriptionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftSubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
