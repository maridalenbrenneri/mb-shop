import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  PAYMENT_NOT_STARTED = 1;
  PAYMENT_IN_PROGRESS = 2;
  PAYMENT_COMPLETED = 3;
  PAYMENT_FAILED = 4;

  status: number = this.PAYMENT_NOT_STARTED;

  order: Order;

  constructor(private orderService: OrderService) {  }

  ngOnInit() {
  }

  sendOrder() {
    this.status = this.PAYMENT_IN_PROGRESS;

    this.orderService.createOrder(this.order).subscribe((orderId) => {
      console.log('[DEBUG] Order created, id: ' + orderId);

      this.orderService.payOrder(this.order).subscribe((paymentSuccess) => {
        this.status = paymentSuccess ? this.PAYMENT_COMPLETED : this.PAYMENT_FAILED;
      },
      err => {
        this.setError(err);
      });
    },
    err => {
      this.setError(err);
    });
  }

  private setError(err: Error) {
    console.log('Error when creating order: ' + err.message);
    this.status = this.PAYMENT_FAILED;
  }
}
