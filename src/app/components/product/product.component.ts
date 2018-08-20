import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product;
  url: string;

  constructor(private route: ActivatedRoute, private productService: ProductService) {
    this.product = new Product();
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; // (+) converts string 'id' to a number

      this.productService.getProduct(id).subscribe(product => {
        this.product = product;

      }, err => {
        console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
      });

      // todo: ...
      this.url = 'honduras-ho-danny-moreno';
   });
  }

  isSubscription() {
    return this.product.type === 'subscription';
  }

  isGiftSubscription() {
    return this.product.type === 'gift-subscription';
  }

  isCoffeeNormal() {
    return this.product.type === 'coffee';
  }
}
