import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCategories } from '../../constants';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
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

      this.coffeeProducts = products.filter(product => product.category === ProductCategories.coffee);
      this.subscriptionProduct = this.getFirstProductOfType(products, ProductCategories.coffeeSubscription);
      this.giftSubscriptionProduct = this.getFirstProductOfType(products, ProductCategories.coffeeGiftSubscription);

    }, err => {
      console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
    });
  }

  getFirstProductOfType(products: Array<Product>, category: String) {
    const items = products.filter(p => p.category === category);
    return items.length > 0 ? products.filter(p => p.category === category)[0] : null;
  }

  getProductImageOrDefault(product: Product): string {
    if (product.category === ProductCategories.coffeeSubscription) {
      return 'product_abo.jpg';
    }

    if (product.category === ProductCategories.coffeeGiftSubscription) {
      return 'product_gave_abo.png';
    }

    return !product.portfolioImageKey ? 'product_default.jpg' : product.portfolioImageKey;
  }
}
