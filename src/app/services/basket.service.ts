import { Injectable } from '@angular/core';
import { ProductItem, Product } from '../models/product.model';
import { Observable, of } from 'rxjs';

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

  add(product: Product, quantity: number) {

    if(!this.validateItem(product, quantity, false)) {
      return;
    }

    let existingItem = this.items.find(p => p.product.id == product.id);

    if(!existingItem) {
      this.items.push({
        product: product, 
        quantity: quantity
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
