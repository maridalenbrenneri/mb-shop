import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  text: string;
  products: Array<Product>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Product[]>(environment.mbApiBaseUrl + 'products').subscribe(products => {

      console.log(products);

      this.products = products;

    }, err => {
      console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
    });
  }

  getProductImageOrDefault(product: Product): string {
    return !product.imageKey ? 'product_default.jpg' : product.imageKey;
  }
}
