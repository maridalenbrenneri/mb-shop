import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, SubscriptionProduct, GiftSubscriptionProduct, CoffeeNormalProduct } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product;
  url: string;
  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      
      this.product = this.productService.getProduct(id);
      this.url = "honduras-ho-danny-moreno";
   });
  }

  isSubscription() {
    return this.product instanceof SubscriptionProduct && !(this.product instanceof GiftSubscriptionProduct);
  }

  isGiftSubscription() {
    return this.product instanceof GiftSubscriptionProduct;
  }

  isCoffeeNormal() {
    return this.product instanceof CoffeeNormalProduct;
  }
}
