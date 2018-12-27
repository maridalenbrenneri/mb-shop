import { Component, OnInit } from '@angular/core';
import { GiftSubscription } from '../../models/gift-subscription.model';
import { GiftSubscriptionService } from '../../services/gift-subscription.service';
import { ToastrService } from 'ngx-toastr';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-gift-subscriptions',
  templateUrl: './gift-subscriptions.component.html',
  styleUrls: ['./gift-subscriptions.component.scss']
})
export class GiftSubscriptionsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'status', 'startDate', 'endDate', 'frequency', 'quantity', 'recipient_name'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  private _subscription: Array<GiftSubscription> = [];

  constructor(private giftSubscriptionService: GiftSubscriptionService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.giftSubscriptionService.getSubscriptions().subscribe(subscriptions => {
      this.subscriptions = subscriptions;
    });
  }

  set subscriptions(subscription: Array<GiftSubscription>) {
    this._subscription = subscription;

    // this.applyOrderFilter();
  }
  
  get subscriptions() : Array<GiftSubscription> {
    return this._subscription;
  }  

  createOrder(subscription: GiftSubscription) {
    this.giftSubscriptionService.createOrder(subscription).subscribe(s => {
      this.loadSubscriptions();
      this.toastr.success('Oppdrag for #' + subscription.wooOrderNumber + ' lagt til i Cargonizer');
    });
  }

  import() {
    this.giftSubscriptionService.import().subscribe(result => {
      this.loadSubscriptions();
      this.toastr.success('Importert ' + result.count + ' gabos fra Woo');
    });
  }

}
