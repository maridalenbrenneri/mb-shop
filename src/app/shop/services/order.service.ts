import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';

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

  getOrders(filter: any): Observable<any[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + 'orders');
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + 'orders/mine');
  }

  completeOrder(orderId: Number, completeAndShip: Boolean) {
    const endpoint = completeAndShip ? 'completeAndShip' : 'complete';
    return this.http.post<any>(`${environment.mbApiBaseUrl}orders/${orderId}/${endpoint}`, null);
  }

}