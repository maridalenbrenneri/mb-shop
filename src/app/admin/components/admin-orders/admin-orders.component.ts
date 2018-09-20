import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shop/services/order.service';
import { Order } from '../../../shop/models/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  orders: Array<Order>;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  complete(orderId: Number, completeAndShip: Boolean) {

    this.orderService.completeOrder(orderId, completeAndShip).subscribe(updatedOrder => {
      // todo: update order in ui instead of reloading all...

      this.loadOrders();
    });
  }

  private loadOrders() {
    const filter = {};

    this.orderService.getOrders(filter).subscribe(orders => {

      for (const order of orders) {
        order.customer = JSON.parse(order.customer);
        order.items = JSON.parse(order.items);
      }

      this.orders = orders;
    });
  }
}
