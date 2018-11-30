import { Component, Input } from '@angular/core';
import { TableDataSource } from 'src/app/shop/core/table-data-source';
import { Order } from 'src/app/shop/models/order.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

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

  _orders: Array<Order> = [];
  ordersDataSource: TableDataSource;
  displayedColumns: string[] = ['id', 'name'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor() { }

  @Input()
  set orders(orders: Array<Order>) {
    this._orders = orders;
    this.ordersDataSource = new TableDataSource(this._orders);
  }
}
