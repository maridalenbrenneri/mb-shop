import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable, of } from 'rxjs';
import { OrderItem } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  public items: Array<OrderItem> = [];
  random: string;
  public totaltCount = 0;

  constructor() {
    this.random = Math.random().toString();
  }

  simpleObservable = new Observable<number>((observer) => {
    observer.next(this.totaltCount);
  });

  getItems(): Observable<OrderItem[]> {
    return of(this.items);
  }

  getTotalItemCount(): Observable<number> {
    return of(this.totaltCount);
  }

  add(product: Product, quantity: number, productOptions: any) {

    if (!this.validateItem(product, quantity, false)) {
      return;
    }

    const existingItem = this.items.find(p => p.product.id === product.id);

    if (!existingItem) {
      // this.items.push({
      //   product: product,
      //   productOptions: productOptions,
      //   quantity: quantity
      // });

    } else {
      existingItem.quantity += quantity;
    }

    this.totaltCount += quantity;

   // console.log('[DEBUG]: Product added to basket service, ' + product.name + ' item count ' + this.items.length + ' ' + this.totaltCount);
  }

  private validateItem(product: Product, quantity: number, allowZero: boolean): boolean {
    if (!product) {
      console.log('WARNING: Trying to add a ProductItem with no product to basket.');
      return false;
    }

    if (!allowZero && quantity === 0) {
      console.log('WARNING: Trying to add a non-existing item with quantity 0');
      return false;
    }

    return true;
  }
}
