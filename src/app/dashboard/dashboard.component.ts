import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  wooApiBaseUrl = 'https://maridalenbrenneri.no/wp-json/wc/v2/';
  wooSubscriptionApiBaseUrl = 'https://maridalenbrenneri.no/wp-json/wc/v1/';

  subscriptions: Array<any>;

  subscriptionActiveCount = 0;
  subscriptionOnHoldCount = 0;
  subscriptionFortnightlyCount = 0;
  subscriptionMonthlyCount = 0;
  subsciptionsBagsPerMonthCount = 0;

  orderProcessingCount = 0;
  orderPendingPaymentCount = 0;

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
          this.subsciptionsBagsPerMonthCount += this.resolveNumberOfBags(item.name) * 2;

        } else  {
          this.subscriptionMonthlyCount++;
          this.subsciptionsBagsPerMonthCount += this.resolveNumberOfBags(item.name);
        }

      }
    });

    this.http.get<any>(this.wooApiBaseUrl + 'orders?' + this.keySecretParams() + '&status=processing').subscribe(orders => {
      this.orderProcessingCount = orders.length;
    });

    this.http.get<any>(this.wooApiBaseUrl + 'orders?' + this.keySecretParams() + '&status=pending').subscribe(orders => {
      this.orderPendingPaymentCount = orders.length;
    });

  }

  private resolveNumberOfBags(name) {
    if (name.includes('- 1')) {
      return 1;
    } else if (name.includes('- 2')) {
      return 2;
    } else if (name.includes('- 3')) {
      return 3;
    } else if (name.includes('- 4')) {
      return 4;
    } else if (name.includes('- 5')) {
      return 5;
    } else {
      throw new Error('Not supported subscription item name');
    }
  }

  private keySecretParams() {
    // tslint:disable-next-line:max-line-length
    return 'consumer_key=ck_d74710a954f7e7c79059ba92f4124040775d5e8e&consumer_secret=cs_3bebfa21a4e4d6341a3a6a1517c15c1fc6e1c293&per_page=100';
  }

}
