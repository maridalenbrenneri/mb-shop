import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftSubscriptionsComponent } from './gift-subscriptions.component';

describe('GiftSubscriptionsComponent', () => {
  let component: GiftSubscriptionsComponent;
  let fixture: ComponentFixture<GiftSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
