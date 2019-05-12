import { Component, Input, EventEmitter, Output, Inject } from "@angular/core";
import { Order, OrderNote } from "src/app/shop/models/order.model";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { MatDialog } from "@angular/material";
import { Customer } from "src/app/shop/models/customer.model";
import { TableDataSource } from "src/app/shop/core/table-data-source";
import { OrderStatus } from "src/app/constants";
import { Product } from "../../..//models/product.model";
import { OrderEditComponent } from "../order-edit/order-edit.component";
import { Utils } from "../../../../utils";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class OrderListComponent {
  ordersDataSource: TableDataSource;
  displayedColumns: string[] = [
    "id",
    "status",
    "orderDate",
    "customerName",
    "items"
  ];
  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");
  expandedElement: any;

  private _orders: Array<Order> = [];
  private _filteredOrders: Array<Order> = [];
  private _customers: Array<Customer>;
  private _products: Array<Product>;

  private _selectedCustomer: Customer;
  private _showProcessing: boolean = true;
  private _showCompleted: boolean;
  private _showCanceled: boolean;

  @Output() completed = new EventEmitter<number>();
  @Output() completedAndShipped = new EventEmitter<Order>();
  @Output() canceled = new EventEmitter<number>();
  @Output() processed = new EventEmitter<number>();
  @Output() addedNote = new EventEmitter<OrderNote>();
  @Output() createdInvoice = new EventEmitter<Order>();
  @Output() updated = new EventEmitter<Order>();

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.selectedCustomer = this._customers[0];
  }

  @Input()
  set orders(orders: Array<Order>) {
    this._orders = orders;
    this.applyOrderFilter();
  }

  get orders(): Array<Order> {
    return this._filteredOrders;
  }

  @Input()
  set customers(customers: Array<Customer>) {
    this._customers = JSON.parse(JSON.stringify(customers));
    const all = new Customer();
    all.name = "Alle kunder";
    all.customerNumber = 0;
    this._customers.unshift(all);
  }

  get customers(): Array<Customer> {
    return this._customers;
  }

  @Input()
  set products(products: Array<Product>) {
    this._products = products;
  }

  get products(): Array<Product> {
    return this._products;
  }

  set selectedCustomer(customer: Customer) {
    this._selectedCustomer = customer;
    this.applyOrderFilter();
  }

  set showProcessing(show: boolean) {
    this._showProcessing = show;
    this.applyOrderFilter();
  }

  get showProcessing() {
    return this._showProcessing;
  }

  set showCompleted(show: boolean) {
    this._showCompleted = show;
    this.applyOrderFilter();
  }

  set showCanceled(show: boolean) {
    this._showCanceled = show;
    this.applyOrderFilter();
  }

  applyOrderFilter() {
    if (!this._selectedCustomer || !this._selectedCustomer.customerNumber) {
      this._filteredOrders = this._orders;
    } else {
      this._filteredOrders = this._orders.filter(
        o => o.customer.customerNumber == this._selectedCustomer.customerNumber
      );
    }

    if (!this._showProcessing) {
      this._filteredOrders = this._filteredOrders.filter(
        o => o.status !== OrderStatus.processing
      );
    }

    if (!this._showCompleted) {
      this._filteredOrders = this._filteredOrders.filter(
        o => o.status !== OrderStatus.completed
      );
    }

    if (!this._showCanceled) {
      this._filteredOrders = this._filteredOrders.filter(
        o => o.status !== OrderStatus.canceled
      );
    }

    this.ordersDataSource = new TableDataSource(this._filteredOrders);
  }

  checkCustomerId(data: any, filter: string) {
    if (!data || !data.customer || !data.customer.id) {
      return false;
    }

    return data.customer.id.toString() === filter;
  }

  openEditProductDialog(order: Order): void {
    const self = this;

    if (!order) {
      console.warn("Order was null, cannot edit");
      return;
    }

    const dialogRef = this.dialog.open(OrderEditComponent, {
      disableClose: true,
      data: {
        order: Utils.clone(order),
        customers: self.customers,
        products: self.products
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.updated.emit(result.order);
    });
  }

  completeOrder(order: Order) {
    this.completed.emit(order.id);
  }

  completeAndShipOrder(order: Order) {
    this.completedAndShipped.emit(order);
  }

  cancelOrder(order: Order) {
    this.canceled.emit(order.id);
  }

  processOrder(order: Order) {
    this.processed.emit(order.id);
  }

  createInvoice(order: Order) {
    this.createdInvoice.emit(order);
  }

  viewInvoice(order: Order) {
    console.log("viewInvoice not yet implemented...");
  }

  getArticlesShort(order: Order) {
    const arr = order.items.map(item => {
      const code =
        item.product.data && item.product.data.code
          ? item.product.data.code
          : "";
      let name = "";

      if (item.productVariation.name === "250gr") name = `${code}`;
      else if (item.productVariation.name === "1kg") name = `kg${code}`;
      else name = item.productVariation.name; // todo handle stash

      return `${item.quantity}${name}`;
    });

    let str = arr.join();

    if (order.subscriptionData) {
      str = `ABO-${str}`;
    }

    if (str.length > 25) {
      str = str.substr(0, 22);
      str = str.concat("...");
    }

    return str;
  }
}
