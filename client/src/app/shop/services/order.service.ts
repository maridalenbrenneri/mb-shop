import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Order } from "../models/order.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(environment.mbApiBaseUrl + "orders", order);
  }

  updateOrder(order: Order): Observable<any> {
    return this.http.put<any>(
      `${environment.mbApiBaseUrl}orders/${order.id}`,
      order
    );
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + "orders");
  }

  completeOrder(orderId: number) {
    return this.http.post<any>(
      `${environment.mbApiBaseUrl}orders/${orderId}/complete`,
      null
    );
  }

  shipBusinessOrder(order: Order) {
    return this.http.post<any>(
      `${environment.mbApiBaseUrl}shipping/ship-business-order`,
      order
    );
  }

  cancelOrder(orderId: number) {
    return this.http.post<any>(
      `${environment.mbApiBaseUrl}orders/${orderId}/cancel`,
      null
    );
  }

  processOrder(orderId: number) {
    return this.http.post<any>(
      `${environment.mbApiBaseUrl}orders/${orderId}/process`,
      null
    );
  }

  createInvoice(order: Order) {
    return this.http.post<any>(
      `${environment.mbApiBaseUrl}orders/${order.id}/invoice`,
      order
    );
  }
}
