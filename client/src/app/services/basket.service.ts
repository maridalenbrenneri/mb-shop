import { Injectable } from '@angular/core';
import { ProductItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  productItems: Array<ProductItem> = [];

  constructor() { }

  addProductItem(productItem: ProductItem) {

    if(!productItem.product || productItem.product == undefined) {
      console.log("WARNING: Trying to add a ProductItem with no product to basket.");
      return;
    }

    if(productItem.quantity == 0) {
      console.log("WARNING: Trying to add a ProductItem with quantity == 0.");
      return;
    }

    // todo: check if product already in basket and if that's the case update quantity instead of adding

    this.productItems.push(productItem);
  }
}
