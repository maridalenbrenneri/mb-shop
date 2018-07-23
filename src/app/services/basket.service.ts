import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, of } from 'rxjs';
import { OrderItem, SubscriptionOrderOptions } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  public items: Array<OrderItem> = [];
  random: string;

  constructor() { 
    this.random = Math.random().toString();
  }

  getItems() : Observable<OrderItem[]> {
    return of(this.items);
  }

  add(product: Product, quantity: number, options: SubscriptionOrderOptions) {

    if(!this.validateItem(product, quantity, false)) {
      return;
    }

    let existingItem = this.items.find(p => p.product.id == product.id);

    if(!existingItem) {
      this.items.push({
        product: product, 
        quantity: quantity,
        subscriptionOptions: options
      });

    } else {
      existingItem.quantity += quantity;      
    }

    console.log("[DEBUG]: Product added to basket service, " + product.name + " item count " + this.items.length);
  }

  private validateItem(product: Product, quantity: number, allowZero: boolean) : boolean {
    if(!product) {
      console.log("WARNING: Trying to add a ProductItem with no product to basket.");
      return false;
    }

    if(!allowZero && quantity == 0) {
      console.log("WARNING: Trying to add a non-existing item with quantity 0");
      return false;
    }

    return true;
  }
}
