import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Order, StashItem, CoffeeItem } from "../../models/order.model";
import { OrderService } from "../../services/order.service";
import { CustomerService } from "../../services/customer.service";
import { Customer } from "../../models/customer.model";
import { OrderEditComponent } from "./order-edit/order-edit.component";
import { ToastrService } from "ngx-toastr";
import { Utils } from "../../../utils";
import { CoffeeService } from "../../services/coffee.service";
import { Coffee, CoffeeVariation } from "../../models/coffee.model";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"]
})
export class OrdersComponent implements OnInit {
  vatCoffee = 15;

  orders: Array<Order> = [];

  customers: Array<Customer> = [];
  coffees: Array<Coffee> = [];

  orderItem: CoffeeItem;
  stashOrderItem: StashItem;
  order: Order;

  constructor(
    private orderService: OrderService,
    private coffeesService: CoffeeService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadOrders();

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    this.coffeesService.getCoffees().subscribe(products => {
      this.coffees = products.filter(product => product.isActive);
    });
  }

  openEditOrderDialog(order: Order): void {
    const self = this;

    const dialogRef = this.dialog.open(OrderEditComponent, {
      disableClose: true,
      data: {
        order: Utils.clone(order),
        customers: self.customers,
        coffees: self.coffees
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      self.createOrder(result.order);
    });
  }

  createOrder(order: Order) {
    var self = this;

    this.orderService.createOrder(order).subscribe(
      order => {
        this.toastr.success(`Order ${order.id} was created`);
        self.loadOrders();
      },
      err => {
        this.toastr.error(`Error when creating order. ${err.message}`);
      }
    );
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(
      orders => {
        this.orders = orders;
      },
      err => {
        this.toastr.error(`Error when fetching orders. ${err.message}`);
      }
    );
  }

  onProductVariationChange(variation: CoffeeVariation) {
    this.orderItem.price = variation.price;
  }

  alreadyContainsOrder(order: Order) {
    const items = this.orders.filter(p => p.id && p.id === order.id);
    return items.length > 0;
  }

  onOrderUpdated(order: Order) {
    this.orderService.updateOrder(order).subscribe(
      order => {
        this.toastr.success(`Order ${order.id} was updated`);
        this.loadOrders();
      },
      e => {
        console.error("Error", e);
        this.toastr.error("Error when trying to update order");
      }
    );
  }

  onCompleted(orderId: number) {
    this.orderService.completeOrder(orderId).subscribe(
      () => {
        this.toastr.success(`Order ${orderId} was completed`);
        this.loadOrders();
      },
      e => {
        console.error("Error", e);
        this.toastr.error("Error when trying to update order status");
      }
    );
  }

  onCompletedAndShipped(order: Order) {
    this.orderService.completeOrder(order.id).subscribe(
      () => {
        this.orderService.shipBusinessOrder(order).subscribe(
          () => {
            this.toastr.success(`Order ${order.id} was completed and shipped`);
            this.loadOrders();
          },
          e => {
            console.error("Error", e);
            this.toastr.error(e.error);
          }
        );
      },
      e => {
        console.error("Error", e);
        this.toastr.error(e.error);
      }
    );
  }

  onCanceled(orderId: number) {
    this.orderService.cancelOrder(orderId).subscribe(
      () => {
        this.toastr.success(`Order ${orderId} was canceled`);
        this.loadOrders();
      },
      e => {
        console.error("Error", e);
        this.toastr.error("Error when trying to update order status");
      }
    );
  }

  onProcessed(orderId: number) {
    this.orderService.processOrder(orderId).subscribe(
      () => {
        this.toastr.success(`Order ${orderId} was set in process`);
        this.loadOrders();
      },
      e => {
        console.error("Error", e);
        this.toastr.error("Error when trying to update order status");
      }
    );
  }

  onCreatedInvoice(order: Order) {
    this.orderService.createInvoice(order).subscribe(() => {
      this.loadOrders();
    });
  }

  // onOrderCreated(order: Order) {
  //   this.loadOrders();
  // }

  get diagnostic() {
    return JSON.stringify(this.order.customer);
  }
}
