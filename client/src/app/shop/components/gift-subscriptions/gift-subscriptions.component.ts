import { Component, OnInit } from '@angular/core';
import { GiftSubscription } from '../../models/gift-subscription.model';
import { GiftSubscriptionService } from '../../services/gift-subscription.service';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionFrequence } from 'src/app/constants';

@Component({
  selector: 'app-gift-subscriptions',
  templateUrl: './gift-subscriptions.component.html',
  styleUrls: ['./gift-subscriptions.component.scss']
})
export class GiftSubscriptionsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'status', 'startDate', 'endDate', 'frequency', 'quantity', 'recipient_name'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  private _subscriptions: Array<GiftSubscription> = [];
  private _filteredSubscriptions: Array<GiftSubscription> = [];
  private _quantities: Array<any> = []; 
  private _selectedQuantity: any;
  private _showMonthly: boolean = true;
  private _showFortnightly: boolean = true;
  private _showOnlyNew: boolean = false;

  constructor(private giftSubscriptionService: GiftSubscriptionService, private toastr: ToastrService) { 
    this._quantities.push({quantity: 0, label: "Alle"});
    this._quantities.push({quantity: 1, label: "1 pose"});
    this._quantities.push({quantity: 2, label: "2 poser"});

    this._selectedQuantity = this._quantities[0];
  }

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.giftSubscriptionService.getSubscriptions().subscribe(subscriptions => {
      this.subscriptions = subscriptions;
      this.applyFilter();
    });
  }

  set subscriptions(subscriptions: Array<GiftSubscription>) {
    this._subscriptions = subscriptions;
    this.applyFilter();
  }

  get subscriptions() : Array<GiftSubscription> {
    return this._filteredSubscriptions;
  }  

  set showMonthly(show: boolean) {
    this._showMonthly = show;
    this.applyFilter();
  }

  get showMonthly() : boolean {
    return this._showMonthly;
  }

  set showFortnightly(show: boolean) {
    this._showFortnightly = show;
    this.applyFilter();
  }
  
  get showOnlyNew() : boolean {
    return this._showOnlyNew;
  }

  set showOnlyNew(show: boolean) {
    this._showOnlyNew = show;
    this.applyFilter();
  }
  
  get showFortnightly() : boolean {
    return this._showFortnightly;
  }

  set selectedQuantity(quantity) {
    this._selectedQuantity = quantity;
    this.applyFilter();
  }

  get selectedQuantity() {
    return this._selectedQuantity;
  }

  get quantities() : Array<any> {
    return this._quantities;
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

  applyFilter() {
    if(!this._selectedQuantity.quantity) {
      this._filteredSubscriptions = this._subscriptions;
    
    } else {
      this._filteredSubscriptions = this._subscriptions.filter(s => s.quantity === this._selectedQuantity.quantity);
    }

    if(!this._showMonthly) {
      this._filteredSubscriptions = this._filteredSubscriptions.filter(s => s.frequence !== SubscriptionFrequence.monthly);
    }

    if(!this._showFortnightly) {
      this._filteredSubscriptions = this._filteredSubscriptions.filter(s => s.frequence !== SubscriptionFrequence.fortnightly);
    }

    if(this.showOnlyNew) {
      this._filteredSubscriptions = this._filteredSubscriptions.filter(s => !s.lastOrderCreated);
    }
  }
}
