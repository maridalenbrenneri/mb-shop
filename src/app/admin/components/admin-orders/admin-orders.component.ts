import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  orders: Array<any>;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getOrders().subscribe(orders => {

      for (const order of orders) {
        order.customer = JSON.parse(order.customer);
        order.items = JSON.parse(order.items);
      }

      this.orders = orders;
    } );
  }

}
