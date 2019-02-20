import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order, OrderNote } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(environment.mbApiBaseUrl + 'orders', order);
  }

  updateOrder(order: Order): Observable<any> {
    return this.http.put<any>(`${environment.mbApiBaseUrl}orders/${order.id}`, order);
  }

  payOrder(order: Order): Observable<boolean> {
    return of(true);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + 'orders');
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + 'orders/mine');
  }

  completeOrder(orderId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}orders/${orderId}/complete`, null);
  }

  shipBusinessOrder(order: Order) { 
    return this.http.post<any>(`${environment.mbApiBaseUrl}shipping/ship-business-order`, order);
  }

  cancelOrder(orderId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}orders/${orderId}/cancel`, null);
  }

  processOrder(orderId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}orders/${orderId}/process`, null);
  }

  addOrderNote(note: OrderNote) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}orders/${note.orderId}/notes`, note);
  }

  createInvoice(order: Order) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}orders/${order.id}/invoice`, order);
  }
}
