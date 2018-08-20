import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.mbApiBaseUrl}products/${id}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.mbApiBaseUrl + 'products');
  }
}
