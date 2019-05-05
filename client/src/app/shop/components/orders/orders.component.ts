import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Order, OrderItem, OrderNote } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Product, ProductVariation } from '../../models/product.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { ToastrService } from 'ngx-toastr';

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
    private customerService: CustomerService, public dialog: MatDialog, private toastr: ToastrService) {
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

  openEditProductDialog(order: Order): void {
    const self = this;

    const dialogRef = this.dialog.open(OrderEditComponent, {
      disableClose: true,
      data: {
        order: order,
        customers: self.customers,
        products: self.products
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      const order = JSON.parse(JSON.stringify(result.order));

      this.orderService.createOrder(order).subscribe((order) => {
        this.toastr.success(`Order ${order.id} was created`);
        self.loadOrders();

      }, err => {
        this.toastr.error(`Error when creating order. ${err.message}`);
      });
    });
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    }, err => {
      this.toastr.error(`Error when fetching orders. ${err.message}`);
    });
  }

  onProductVariationChange(productVariation: ProductVariation) {
    this.orderItem.price = productVariation.price;
  }

  alreadyContainsOrder(order: Order) {
    const items = this.orders.filter(p => p.id && p.id === order.id);
    return items.length > 0;
  }

  onOrderUpdated(order: Order) {
    this.orderService.updateOrder(order).subscribe((order) => {
      this.toastr.success(`Order ${order.id} was updated`);
      this.loadOrders();
    });
  }

  onCompleted(orderId: number) {
    this.orderService.completeOrder(orderId).subscribe(() => {
      this.toastr.success(`Order ${orderId} was completed`);
      this.loadOrders();
    });
  }

  onCompletedAndShipped(order: Order) {
    this.orderService.completeOrder(order.id).subscribe(() => {
      this.orderService.shipBusinessOrder(order).subscribe(() => {
        this.toastr.success(`Order ${order.id} was completed and shipped`);
        this.loadOrders();
      });
    });
  }

  onCanceled(orderId: number) {
    this.orderService.cancelOrder(orderId).subscribe(() => {
      this.toastr.success(`Order ${orderId} was canceled`);
      this.loadOrders();
    });
  }

  onProcessed(orderId: number) {
    this.orderService.processOrder(orderId).subscribe(() => {
      this.toastr.success(`Order ${orderId} was set in process`);
      this.loadOrders();
    });
  }

  // onAddedNote(note: OrderNote) {
  //   this.orderService.addOrderNote(note).subscribe(() => {
  //     this.loadOrders();
  //   });
  // }

  onCreatedInvoice(order: Order) {
    this.orderService.createInvoice(order).subscribe(() => {
      this.loadOrders();
    });
  }

  // onOrderCreated(order: Order) {
  //   this.loadOrders();
  // }

  get diagnostic() { return JSON.stringify(this.order.customer); }
}
