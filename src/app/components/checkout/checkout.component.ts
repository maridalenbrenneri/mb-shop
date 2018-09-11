import { Component, OnInit } from '@angular/core';
import { Order, OrderCustomer } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { User, RegisterUserModel } from '../../models/user.model';

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
    this.createOrderCustomerFromCurrentUser();
  }

  sendOrder() {
    this.status = this.PAYMENT_IN_PROGRESS;

    const order = new Order();
    order.type = 'normal';
    order.items = this.basketService.items;

    if (this.authService.isSignedIn()) {
      this.sendCreateOrder(order, this.customer);

    } else {
      this.registerAndSignInUserBeforeSendingOrder(order);
    }
  }

  onSignedIn() {
    this.createOrderCustomerFromCurrentUser();
  }

  onCustomerUpdated(customer) {
    this.customer = customer;
  }

  isSignedIn() {
    return this.authService.isSignedIn();
  }

  private registerAndSignInUserBeforeSendingOrder(order) {
    const user = this.customerToRegisterUser(this.customer);

    this.authService.registerUser(user).subscribe(registeredUser => {

      this.authService.signIn(user.email, user.password).subscribe(result => {
        this.authService.setSignedIn(result);

        this.customer = this.userToCustomer(registeredUser);
        this.sendCreateOrder(order, this.customer);
      });

    });
  }

  private sendCreateOrder(order: Order, customer: OrderCustomer) {
    order.customer = customer;

    this.orderService.createOrder(order).subscribe((createdOrder) => {

      this.status = this.PAYMENT_COMPLETED;

    }, () => {
        this.status = this.PAYMENT_FAILED; // todo: do something else... :P Make customized errors, payment_failed/etc.
    });
  }

  private userToCustomer(user) {
    const customer = new OrderCustomer();
    customer.userId = user.id;
    customer.givenName = user.givenName;
    customer.familyName = user.familyName;
    customer.email = user.email;
    customer.phone = user.phone;
    return customer;
  }

  private customerToRegisterUser(customer: OrderCustomer) {
    const user = new RegisterUserModel();
    user.email = customer.email;
    user.givenName = customer.givenName;
    user.familyName = customer.familyName;
    user.phone = customer.phone;
    user.password = customer.password;
    return user;
  }

  private createOrderCustomerFromCurrentUser() {
    if (!this.authService.isSignedIn()) {
      return;
    }

    this.authService.getUser().subscribe(user => {
      this.customer = this.userToCustomer(user);
    });
  }
}
