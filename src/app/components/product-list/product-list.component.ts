import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductTypes } from '../../constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  text: string;
  coffeeProducts: Array<Product>;
  subscriptionProduct: Product;
  giftSubscriptionProduct: Product;

  constructor(private productService: ProductService) {
    this.subscriptionProduct = new Product();
    this.giftSubscriptionProduct = new Product();
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {

      this.coffeeProducts = products.filter(product => product.type === ProductTypes.coffee);
      this.subscriptionProduct = this.getFirstProductOfType(products, ProductTypes.coffeeSubscription);
      this.giftSubscriptionProduct = this.getFirstProductOfType(products, ProductTypes.coffeeGiftSubscription);

    }, err => {
      console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
    });
  }

  getFirstProductOfType(products: Array<Product>, type: String) {
    const items = products.filter(p => p.type === type);
    return items.length > 0 ? products.filter(p => p.type === type)[0] : null;
  }

  getProductImageOrDefault(product: Product): string {
    if (product.type === ProductTypes.coffeeSubscription) {
      return 'product_abo.jpg';
    }

    if (product.type === ProductTypes.coffeeGiftSubscription) {
      return 'product_gave_abo.png';
    }

    return !product.imageKey ? 'product_default.jpg' : product.imageKey;
  }
}
