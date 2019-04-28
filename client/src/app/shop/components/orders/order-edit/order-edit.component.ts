import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Order, OrderItem } from '../../../models/order.model';
import { Customer } from '../../../models/customer.model';
import { Product, ProductVariation } from '../../..//models/product.model';
import { OrderService } from '../../../services/order.service';

const small = new ProductVariation();
small.name = "250gr";
small.price = 70.00;
small.weight = 250;

const large = new ProductVariation();
large.name = "1kg";
large.price = 280.00;
large.weight = 1000;

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {

  @Output() orderCreated = new EventEmitter<Order>();

  _order: Order;
  _customers: Array<Customer>;
  _products: Array<Product>;

  orderItem: OrderItem;
  stashOrderItem: OrderItem;

  constructor(private orderService: OrderService) {
    this.order = new Order();
    this.orderItem = new OrderItem();
  }

  ngOnInit() {
    this.initOrder();
    this.initOrderItem();
    this.initStashOrderItem();
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
    this.orderItem.price = this.orderItem.productVariation.price;
  }

  initStashOrderItem() {
    this.stashOrderItem = new OrderItem;
    this.stashOrderItem.product = new Product();
    this.stashOrderItem.product.vatGroup = "standard";
    this.stashOrderItem.product.category = 'stash';
    this.stashOrderItem.productVariation = new ProductVariation();
    this.stashOrderItem.quantity = 1;
  }

  addCoffee() {
    let productAdded = this.order.items.find(i => {
      return i.product.id === this.orderItem.product.id &&
        i.productVariation.name == this.orderItem.productVariation.name &&
        i.productVariation.price == this.orderItem.price;
    });

    if (!productAdded) {

      // clone and set possibly custom price 
      const json = JSON.stringify(this.orderItem.productVariation);
      this.orderItem.productVariation = JSON.parse(json);
      this.orderItem.productVariation.price = this.orderItem.price;

      this.order.items.push(this.orderItem);

    } else {
      productAdded.quantity += this.orderItem.quantity;
    }

    this.initOrderItem();
  }

  addStash() {
    this.order.items.push(this.stashOrderItem);
    this.initStashOrderItem();
  }

  createOrder() {
    const self = this;
    this.orderService.createOrder(this.order).subscribe(() => {
      this.initOrder();
      this.initOrderItem();
      this.initStashOrderItem();

      this.orderCreated.emit(self.order);

    }, (error: any) => console.log(error));
  }

  onProductVariationChange(productVariation: ProductVariation) {
    this.orderItem.price = productVariation.price;
  }

  get getCoffeeProductVariations() {
    return [small, large];
  }

  resolveCoffeeProductName(product: Product) {
    if (!product) { return ''; }

    if (product.category === 'coffee') {
      return `${product.data.country} - ${product.data.name} (${product.data.code})`;
    }
    return product.data.name;
  }

  resolveProductVariationString(variation: ProductVariation) {
    return !variation ? '' : variation.name + ' - Normalpris: ' + variation.price + ' kr';
  }

  @Input()
  set order(order: Order) { this._order = order; }
  get order() { return this._order; }

  @Input()
  set customers(customers: Array<Customer>) { this._customers = customers; }
  get customers() { return this._customers; }

  @Input()
  set products(products: Array<Product>) { this._products = products; }
  get products() { return this._products; }

}
