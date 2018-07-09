import { Injectable } from '@angular/core';
import { ProductItem } from '../models/product.model';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  public items: Array<ProductItem> = [];
  random: string;

  constructor() { 
    this.random = Math.random().toString();
  }

  getItems() : Observable<ProductItem[]> {
    return of(this.items);
  }

  addItem(item: ProductItem) {

    if(!this.validateItem(item, false)) {
      return;
    }

    let existingItem = this.items.find(p => p.product.id == item.product.id);

    if(existingItem) {
      existingItem.quantity += item.quantity;
      
    } else {
      this.items.push(item);
    }

    console.log("[DEBUG]: Product added to basket service, " + item.product.name + " item count " + this.items.length);
  }

  updateItemQuantity(item: ProductItem) {

  }

  private validateItem(item: ProductItem, allowZero: boolean) : boolean {
    if(!item.product || item.product == undefined) {
      console.log("WARNING: Trying to add a ProductItem with no product to basket.");
      return false;
    }

    if(!allowZero && item.quantity == 0) {
      console.log("WARNING: Trying to add a non-existing item with quantity 0");
      return false;
    }

    return true;
  }
}
