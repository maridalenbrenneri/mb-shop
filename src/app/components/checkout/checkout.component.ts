import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  private PAYMENT_NOT_STARTED: number = 1;
  private PAYMENT_IN_PROGRESS: number = 2;
  private PAYMENT_COMPLETED: number = 3;
  private PAYMENT_FAILED: number = 4;

  status: number = this.PAYMENT_NOT_STARTED;

  private order: Order;
  paymentInProgress: boolean;

  constructor(private orderService: OrderService) {  }

  ngOnInit() {
  }

  sendOrder() {
    this.status = this.PAYMENT_IN_PROGRESS;

    this.orderService.createOrder.subscribe((orderId) => {
      console.log('[DEBUG] Order created, id: ' + orderId);

      this.orderService.payOrder.subscribe((paymentSuccess) => {
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
