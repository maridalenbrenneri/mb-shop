import { Component, OnInit, Inject } from '@angular/core';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ProductService } from '../../services/product.service';
import { Product, ProductVariation } from '../../models/product.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

const small = new ProductVariation();
small.name = "250gr";
small.price = 72.20;
const large = new ProductVariation();
large.name = "1,2kg";
large.price = 280.00;

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
  order: Order;

  constructor(private orderService: OrderService, private productService: ProductService,
    private customerService: CustomerService, public dialog: MatDialog) {
    
      this.order = new Order();
      this.orderItem = new OrderItem();
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders({}).subscribe(orders => {
      // todo: why is this neccessary?
      for (const order of orders) {
        order.customer = JSON.parse(order.customer);
        order.items = JSON.parse(order.items);
      }
      this.orders = orders;
    });

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.initOrder();
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.initOrderItem();
    });
  }

  initOrder() {
    this.order = new Order();

    this.order.type = "normal";
    this.order.customer = this.customers[0];
    this.order.items = new Array<OrderItem>();
  }

  initOrderItem() {
    this.orderItem = new OrderItem();

    this.orderItem.product = this.products[0];
    this.orderItem.productVariation = this.getCoffeeProductVariations[0];
    this.orderItem.quantity = 1;
  }

  addCoffee() {
    this.order.items.push(this.orderItem);
    this.initOrderItem();
  }

  removeItem(item) {
    this.order.items.filter(i => i )
  }

  createOrder() {
    this.orderService.createOrder(this.order).subscribe(result => {
      this.loadOrders();
    });
  }

  alreadyContainsOrder(order: Order) {
    const items = this.orders.filter(p => p.id && p.id  === order.id);
    return items.length > 0;
  }

  resolveCoffeeProductName(product: Product) {
    if(!product) { return ''; }

    if(product.category === 'coffee') {
      return `${product.data.country} - ${product.data.name} (${product.data.code})`; 
    }

    return 'Unknown';
  }

  resolveProductVariationString(variation: ProductVariation) {
    return !variation ? '' : variation.name + ' - ' + variation.price + ' kr';
  }

  get getCoffeeProductVariations() { 
    return [ small, large ];
  }

  onCompleted(orderId: number) {
    this.orderService.completeOrder(orderId).subscribe(() => {
      this.loadOrders();
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

  get diagnostic() { return JSON.stringify(this.order.customer); }
}
