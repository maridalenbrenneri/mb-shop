import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../mock-products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getAllProducts() {
    return PRODUCTS;
  }

  getProduct(productId: number): Product {
    return PRODUCTS.find(p => p.id === productId);
  }
}
