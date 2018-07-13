import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  public createOrder = new Observable((observer) => {
    let orderId = 1;
    observer.next(orderId);
  });

  public payOrder = new Observable((observer) => {
    let v = true;
    observer.next(v);
  });
}
