import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductTypes } from '../../constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductService]
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

      const subscriptions = products.filter(product => product.type === ProductTypes.coffeeSubscription);
      this.subscriptionProduct = subscriptions.length > 0
        ? products.filter(product => product.type === ProductTypes.coffeeSubscription)[0]
        : null;

      const giftSubscriptions = products.filter(product => product.type === ProductTypes.coffeeGiftSubscription);
      this.giftSubscriptionProduct = giftSubscriptions.length > 0
        ? products.filter(product => product.type === ProductTypes.coffeeGiftSubscription)[0]
        : null;

    }, err => {
      console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
    });
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
