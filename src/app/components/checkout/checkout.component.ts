import { Component, OnInit } from '@angular/core';
import { Order, OrderCustomer } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';

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
  customer: OrderCustomer;

  constructor(private orderService: OrderService, private basketService: BasketService, private authService: AuthService) {
    this.customer = new OrderCustomer();
  }

  ngOnInit() {
    this.createOrderCustomerFromUser();
  }

  sendOrder() {
    this.status = this.PAYMENT_IN_PROGRESS;

    const order = new Order();
    order.items = this.basketService.items;
    order.customer = this.customer;

    this.orderService.createOrder(order).subscribe((createdOrder) => {
      console.log('[DEBUG] Order created, id: ' + createdOrder.id);

      this.status = this.PAYMENT_COMPLETED;

    }, () => {
        this.status = this.PAYMENT_FAILED; // todo: do something else... :P Make customized errors, payment_failed/etc.
    });
  }

  onSignedIn() {
    this.createOrderCustomerFromUser();
  }

  onCustomerUpdated(customer) {
    this.customer = customer;
  }

  isSignedIn() {
    return this.authService.isSignedIn();
  }

  private createOrderCustomerFromUser() {
    if (!this.authService.isSignedIn()) {
      return;
    }

    this.authService.getUser().subscribe(user => {

      const customer = new OrderCustomer();

      customer.userId = user.id;
      customer.givenName = user.givenName;
      customer.familyName = user.familyName;
      customer.email = user.email;
      customer.phone = user.phone;

      this.customer = customer;
    });
  }
}
