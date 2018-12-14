import { Component, OnInit, Input } from '@angular/core';
import { GiftSubscription } from 'src/app/shop/models/gift-subscription.model';

@Component({
  selector: 'app-gift-subscription-details',
  templateUrl: './gift-subscription-details.component.html',
  styleUrls: ['./gift-subscription-details.component.scss']
})
export class GiftSubscriptionDetailsComponent implements OnInit {

  _subscription: GiftSubscription;

  constructor() { }

  ngOnInit() {
  }

  get subscription() {
    return this._subscription;
  }

  @Input()
  set subscription(subscription: GiftSubscription) {
    this._subscription = subscription;
  }

  get diagnose() {
    return JSON.stringify(this.subscription);
  }

}
