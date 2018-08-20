import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<any> {
    console.log('[DEBUG] Creating order... ' + JSON.stringify(order));
    return this.http.post<any>(environment.mbApiBaseUrl + 'orders', order);
  }

  payOrder(order: Order): Observable<boolean> {
    return of(true);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + 'orders');
  }
}
