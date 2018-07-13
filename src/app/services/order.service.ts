import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  createOrder(order: Order): Observable<number> {
    let orderId = 1;
    return of(orderId);
  }

  payOrder(order: Order): Observable<boolean> {
    let success = true;
    return of(success);
  }
}
