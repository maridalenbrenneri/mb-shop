import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  orders: Array<Order>;

  constructor(private orderService: OrderService) {
    this.orders = new Array<Order>();
  }

  ngOnInit() {
    this.getOrders();
  }

  private getOrders() {
    this.orderService.getMyOrders().subscribe(orders => {

      for (const order of orders) {
        order.items = JSON.parse(order.items);
      }

      this.orders = orders;
    });
  }

}
