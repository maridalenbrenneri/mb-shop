import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/shop/models/order.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  _order: Order;

  constructor() { }

  ngOnInit() {
  }

  get order() {
    return this._order;
  }
  
  @Input()
  set order(order: Order) {
    this._order = order;
  }
}
