import { TestBed } from '@angular/core/testing';

import { GiftSubscriptionService } from './gift-subscription.service';

describe('GiftSubscriptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GiftSubscriptionService = TestBed.get(GiftSubscriptionService);
    expect(service).toBeTruthy();
  });
});
