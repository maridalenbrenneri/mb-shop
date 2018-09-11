import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../services/subscription.service';
import { Subscription } from '../../../models/subscription.model';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit {

  subscriptions: Array<Subscription>;

  constructor(private subscriptionService: SubscriptionService) {
    this.subscriptions = new Array<Subscription>();
  }

  ngOnInit() {
    this.getSubscriptions();
  }

  private getSubscriptions() {
    this.subscriptionService.getMySubscriptions().subscribe(subscriptions => {
      this.subscriptions = subscriptions;
    });
  }

  activate(subscription: Subscription) {
    this.subscriptionService.activateSubscription(subscription.id).subscribe(() => {
      this.getSubscriptions();
    });
  }

  pause(subscription: Subscription) {
    this.subscriptionService.pauseSubscription(subscription.id).subscribe(() => {
      this.getSubscriptions();
    });
  }

  cancel(subscription: Subscription) {
    this.subscriptionService.cancelSubscription(subscription.id).subscribe(() => {
      this.getSubscriptions();
    });
  }

  isActive(subscription: Subscription) { return subscription.status === 'active'; }
  isPaused(subscription: Subscription) { return subscription.status === 'on-hold'; }
  isCancelled(subscription: Subscription) { return subscription.status === 'pending-cancel' || subscription.status === 'cancelled'; }

  getSubscriptionSummary(subscription) {
    const bags = subscription.quantity > 1 ? 'påser' : 'påse';

    if(subscription.frequency === 1) {
      return subscription.quantity + ' ' + bags + ' var måned';

    } else {
      return subscription.quantity + ' ' + bags + ' annenhver uke';
    }
  }
}
