import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  wooApiBaseUrl = 'https://maridalenbrenneri.no/wp-json/wc/v2/';
  wooSubscriptionApiBaseUrl = 'https://maridalenbrenneri.no/wp-json/wc/v1/';

  giftSubscriptionProductId = 968;

  subscriptions: Array<any>;

  subscriptionActiveCount = 0;
  subscriptionOnHoldCount = 0;
  subscriptionFortnightlyCount = 0;
  subscriptionMonthlyCount = 0;
  subsciptionsBagsPerMonthCount = 0;
  subsciptionsBagsPerFortnightlyCount = 0;
  subsciptionsBagsPerMonthlyCount = 0;

  orderProcessingCount = 0;
  orderPendingPaymentCount = 0;

  giftSubscriptionCount = 0;
  giftSubscriptionFortnightlyCount = 0;
  giftSubscriptionMonthlyCount = 0;

  bagCounter = {
    fortnightly: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0
    },
    monthly: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.http.get<any>(this.wooSubscriptionApiBaseUrl + 'subscriptions?' + this.keySecretParams()).subscribe(subscriptions => {
      this.subscriptions = subscriptions;

      const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

      this.subscriptionActiveCount = activeSubscriptions.length;
      this.subscriptionOnHoldCount = subscriptions.filter(s => s.status === 'on-hold').length;

      for (const sub of activeSubscriptions) {
        if (!sub.line_items || sub.line_items.length === 0) {
          continue;
        }
        const item = sub.line_items[0];

        if (item.name.includes('Annenhver uke')) {
          this.subscriptionFortnightlyCount++;
          const numberOfBags = this.resolveNumberOfBags(item.name, true);
          this.subsciptionsBagsPerFortnightlyCount += numberOfBags;
          this.subsciptionsBagsPerMonthCount += numberOfBags * 2;

        } else  {
          this.subscriptionMonthlyCount++;
          const numberOfBags = this.resolveNumberOfBags(item.name, false);
          this.subsciptionsBagsPerMonthlyCount += numberOfBags;
          this.subsciptionsBagsPerMonthCount += numberOfBags;
        }

        this.http.get<any>(this.wooApiBaseUrl + 'orders?' + this.keySecretParams() + '&status=processing').subscribe(orders => {
          this.orderProcessingCount = orders.length;

          this.http.get<any>(this.wooApiBaseUrl + 'orders?' + this.keySecretParams() + '&status=pending').subscribe(pendingOrders => {
            this.orderPendingPaymentCount = pendingOrders.length;
          });
        });
      }
    });

    // tslint:disable-next-line:max-line-length
    this.http.get<any>(this.wooApiBaseUrl + 'orders?' + this.keySecretParams() + '&product=' + this.giftSubscriptionProductId).subscribe(giftSubscriptionOrders => {
      this.resolveActiveGiftSubscriptions (giftSubscriptionOrders);
    });
  }

  private updateBagCounter(bagsToAdd: number, isFortnigthly: boolean) {
    if (bagsToAdd === 1) {
      if (isFortnigthly) {
        this.bagCounter.fortnightly.one += 1;
      } else {
        this.bagCounter.monthly.one += 1;
      }
      return 1;
    }

    if (bagsToAdd === 2) {
      if (isFortnigthly) {
        this.bagCounter.fortnightly.two += 1;
      } else {
        this.bagCounter.monthly.two += 1;
      }
      return 2;
    }

    if (bagsToAdd === 3) {
      if (isFortnigthly) {
        this.bagCounter.fortnightly.three += 1;
      } else {
        this.bagCounter.monthly.three += 1;
      }
      return 3;
    }

    if (bagsToAdd === 4) {
      if (isFortnigthly) {
        this.bagCounter.fortnightly.four += 1;
      } else {
        this.bagCounter.monthly.four += 1;
      }
      return 4;
    }

    if (bagsToAdd === 5) {
      if (isFortnigthly) {
        this.bagCounter.fortnightly.five += 1;
      } else {
        this.bagCounter.monthly.five += 1;
      }
      return 5;
    }

    throw new Error('Not supported bag count');

  }

  private resolveNumberOfBags(name, isFortnigthly) {

    if (name.includes('- 1')) {
      return this.updateBagCounter(1, isFortnigthly);
    }

    if (name.includes('- 2')) {
      return this.updateBagCounter(2, isFortnigthly);
    }

    if (name.includes('- 3')) {
      return this.updateBagCounter(3, isFortnigthly);
    }

    if (name.includes('- 4')) {
      return this.updateBagCounter(4, isFortnigthly);
    }

    if (name.includes('- 5')) {
      return this.updateBagCounter(5, isFortnigthly);
    }
  }

  private resolveActiveGiftSubscriptions(orders: any) {

    const activeGiftSubscriptions = new Array<any>();

    for (const order of orders) {
      for (const item of order.line_items) {
        if (item.product_id === this.giftSubscriptionProductId) {

          const startDateString = this.getMetadataValue(item.meta_data, 'abo_start');

          const length = this.getMetadataValue(item.meta_data, 'antall-maneder');

          const startDate = moment(startDateString, 'DD.MM.YYYY');

          const activeFrom = moment(startDate).add(-7, 'days');
          const activeTo = moment(activeFrom).add(+length, 'months');

          const today = moment().startOf('day');

          if (today <= activeTo) {
            activeGiftSubscriptions.push(item);
          }
        }
      }
    }

    for (const sub of activeGiftSubscriptions) {
      const bags = +this.getMetadataValue(sub.meta_data, 'poser');
      const isFortnighlty = this.getMetadataValue(sub.meta_data, 'levering').includes('Annenhver uke');
      this.updateBagCounter(bags, isFortnighlty);

      if (isFortnighlty) {
        this.subsciptionsBagsPerFortnightlyCount += bags;
        this.subsciptionsBagsPerMonthCount += bags * 2;
        this.giftSubscriptionFortnightlyCount++;

      } else {
        this.subsciptionsBagsPerMonthlyCount += bags;
        this.subsciptionsBagsPerMonthCount += bags;
        this.giftSubscriptionMonthlyCount++;
      }
    }

    this.giftSubscriptionCount = activeGiftSubscriptions.length;
  }

  private getMetadataValue(meta_data: Array<any>, key: string) {
    const res =  meta_data.find(data => data.key === key);
    return !res ? null : res.value;
  }

  private keySecretParams() {
    // tslint:disable-next-line:max-line-length
    return 'consumer_key=ck_d74710a954f7e7c79059ba92f4124040775d5e8e&consumer_secret=cs_3bebfa21a4e4d6341a3a6a1517c15c1fc6e1c293&per_page=100';
  }

}
