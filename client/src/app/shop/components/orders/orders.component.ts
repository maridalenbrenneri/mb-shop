import { Component, OnInit } from '@angular/core';
import { Order, OrderItem, OrderNote } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Product, ProductVariation } from '../../models/product.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  vatCoffee = 15;

  orders: Array<Order> = [];

  customers: Array<Customer> = [];
  products: Array<Product> = [];

  orderItem: OrderItem;
  stashOrderItem: OrderItem;
  order: Order;

  constructor(private orderService: OrderService, private productService: ProductService,
    private customerService: CustomerService) {

    this.order = new Order();
    this.orderItem = new OrderItem();
  }

  ngOnInit() {
    this.loadOrders();

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products.filter(product => product.isActive);
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;

    }, error => console.log(error)
    );
  }

  onProductVariationChange(productVariation: ProductVariation) {
    this.orderItem.price = productVariation.price;
  }

  alreadyContainsOrder(order: Order) {
    const items = this.orders.filter(p => p.id && p.id === order.id);
    return items.length > 0;
  }

  onCompleted(orderId: number) {
    this.orderService.completeOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }

  onCompletedAndShipped(order: Order) {
    this.orderService.completeOrder(order.id).subscribe(() => {
      this.orderService.shipBusinessOrder(order).subscribe(() => {
        this.loadOrders();
      });
    });
  }

  onCanceled(orderId: number) {
    this.orderService.cancelOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }

  onProcessed(orderId: number) {
    this.orderService.processOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }

  onAddedNote(note: OrderNote) {
    this.orderService.addOrderNote(note).subscribe(() => {
      this.loadOrders();
    });
  }

  onCreatedInvoice(order: Order) {
    this.orderService.createInvoice(order).subscribe(() => {
      this.loadOrders();
    });
  }

  onOrderCreated(order: Order) {
    this.loadOrders();
  }

  get diagnostic() { return JSON.stringify(this.order.customer); }
}
