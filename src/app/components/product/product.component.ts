import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product;
  url: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.product = new Product();
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; // (+) converts string 'id' to a number

      this.http.get<Product>(`${environment.mbApiBaseUrl}products/${id}`).subscribe(product => {

        console.log(product);
        this.product = product;

      }, err => {
        console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
      });

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
