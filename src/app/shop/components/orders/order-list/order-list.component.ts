import { Component, Input, EventEmitter, Output, Inject } from '@angular/core';
import { Order, OrderNote } from 'src/app/shop/models/order.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Customer } from 'src/app/shop/models/customer.model';
import { TableDataSource } from 'src/app/shop/core/table-data-source';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { OrderStatus } from 'src/app/constants';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])]
})
export class OrderListComponent {

  ordersDataSource: TableDataSource;
  displayedColumns: string[] = ['id', 'status', 'orderDate', 'customerName', 'items'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  private _orders: Array<Order> = [];
  private _filteredOrders: Array<Order> = []; 
  private _customers: Array<Customer>;

  private _selectedCustomer: number;
  private _showProcessing: boolean = true;
  private _showCompleted: boolean;
  private _showCanceled: boolean;

  @Output() completed = new EventEmitter<number>();
  @Output() canceled = new EventEmitter<number>();
  @Output() processed = new EventEmitter<number>();
  @Output() addedNote = new EventEmitter<OrderNote>();
  
  constructor(public dialog: MatDialog) {  }

  @Input()
  set orders(orders: Array<Order>) {
    this._orders = orders;

    this.applyOrderFilter();
  }

  get orders() : Array<Order> {
    return this._filteredOrders;
  }

  @Input()
  set customers(customers: Array<Customer>) {
    this._customers = customers;
    const all = new Customer();
    all.name = 'Alle kunder';
    all.id = 0;
    this._customers.unshift(all)
  }

  get customers() : Array<Customer> { 
    return this._customers; 
  }

  set selectedCustomer(customer: Customer) {
    this._selectedCustomer = customer.id;
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
    if(!this._selectedCustomer) {
      this._filteredOrders = this._orders;
    
    } else {
      this._filteredOrders = this._orders.filter(o => o.customer.id === this._selectedCustomer);
    }

    if(!this._showProcessing) {
      this._filteredOrders = this._filteredOrders.filter(o => o.status !== OrderStatus.processing);
    }

    if(!this._showCompleted) {
      this._filteredOrders = this._filteredOrders.filter(o => o.status !== OrderStatus.completed);
    }

    if(!this._showCanceled) {
      this._filteredOrders = this._filteredOrders.filter(o => o.status !== OrderStatus.canceled);
    }

    this.ordersDataSource = new TableDataSource(this._filteredOrders); 
  }
  
  checkCustomerId(data: any, filter: string) {
    if(!data || !data.customer || !data.customer.id) {
      return false;
    }

    return data.customer.id.toString() === filter;
  }

  openAddNoteDialog(order: Order): void {

    const dialogRef = this.dialog.open(AddOrderNoteComponent, {
      disableClose: true,
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      let orderNote: OrderNote = {
        orderId: order.id,
        date: new Date(),
        note: result,
        user: 'client'
      } ;

      this.addedNote.emit(orderNote)
    });
  }

  completeOrder(order: Order) {
    this.completed.emit(order.id);
  }

  cancelOrder(order: Order) {
    this.canceled.emit(order.id);
  }

  processOrder(order: Order) {
    this.processed.emit(order.id);
  }
  
  createInvoice(order: Order) {
    console.log("createInvoice not yet implemented...");
  }

  viewInvoice(order: Order) {
    console.log("viewInvoice not yet implemented...");
  }
}

@Component({
  selector: 'add-order-note.component',
  templateUrl: 'add-order-note.component.html',
})
export class AddOrderNoteComponent {

  constructor(
    public dialogRef: MatDialogRef<AddOrderNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
