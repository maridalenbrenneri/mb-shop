import { Component, OnInit, Input } from '@angular/core';
import { Order, OrderItem } from 'src/app/shop/models/order.model';
import { VatRates } from 'src/app/constants';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  _order: Order;

  constructor() { }

  ngOnInit() { }

  get order() {
    return this._order;
  }

  @Input()
  set order(order: Order) {
    this._order = order;
  }

  get getTotalPrice(): number {
    if(!this.order.items) { return 0;}

    let total = 0;
    this.order.items.forEach(i => {
      total += i.productVariation.price * i.quantity;
    });
    return total;
  }  

  getVatFromItem(item: OrderItem) {
    if(item.product.vatGroup == 'coffee') {
      return VatRates.coffee * 100;
    }

    return VatRates.standard * 100;
  }

  get getTotalVatCoffee(): number {
    return this.calculateTotalVat("coffee");
  }

  get getTotalVatStandard(): number {
    return this.calculateTotalVat("standard");
  }

  get isOrderCreated(): boolean {
    return this.order.id > 0;
  }

  removeItem(item: OrderItem) {
    const index = this.order.items.findIndex(i => {
      return i.product.id === item.product.id && 
             i.productVariation.name == item.productVariation.name &&
             i.productVariation.price == item.price;
    });

    if(index >= 0) {
      this.order.items.splice(index, 1);
    }
  }  

  private calculateTotalVat(vatGroup: string) {
    if(!this.order.items) { return 0;}

    let rate = vatGroup === "coffee" ? VatRates.coffee : VatRates.standard;
    let total = 0;
    this.order.items.forEach(i => {
      if(i.product.vatGroup === vatGroup) {
        total += (i.productVariation.price * i.quantity) * rate;
      }
    });

    return total;
  }
}
