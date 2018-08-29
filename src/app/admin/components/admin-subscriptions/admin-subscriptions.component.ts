import { Component, OnInit } from '@angular/core';
import { Subscription } from '../../../models/subscription.model';
import { SubscriptionService } from '../../../services/subscription.service';

@Component({
  selector: 'app-admin-subscriptions',
  templateUrl: './admin-subscriptions.component.html',
  styleUrls: ['./admin-subscriptions.component.scss']
})
export class AdminSubscriptionsComponent implements OnInit {

  subscriptions: Array<Subscription>;

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    const filter = {};

    this.subscriptionService.getSubscriptions(filter).subscribe(subscriptions => {

      for (const subscription of subscriptions) {

      }

      this.subscriptions = subscriptions;
    });
  }

}
