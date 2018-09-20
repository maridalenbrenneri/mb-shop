import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Array<Product>;

  constructor(private http: HttpClient) {
    this.products = new Array<Product>();
   }

  getProduct(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      return of(product);
    }

    return this.http.get<Product>(`${environment.mbApiBaseUrl}products/${id}`);
  }

  getProducts(): Observable<Product[]> {
    if (this.products.length > 0) {
      return of(this.products);
    }

    return this.http.get<Product[]>(environment.mbApiBaseUrl + 'products').pipe(map(products => {
      this.products = products;
      return this.products;
    }));
  }
}
