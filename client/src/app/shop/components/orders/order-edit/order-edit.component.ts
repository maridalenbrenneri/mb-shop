import { Component, OnInit, Inject } from "@angular/core";
import { Order, OrderItem, OrderNote } from "../../../models/order.model";
import { Customer } from "../../../models/customer.model";
import { Product, ProductVariation } from "../../../models/product.model";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SubscriptionData } from "src/app/shop/models/subscription-data.model";

export interface OrderData {
  order: Order;
  customers: Array<Customer>;
  products: Array<Product>;
}

const small = new ProductVariation();
small.name = "250gr";
small.price = 70.0;
small.weight = 250;

const large = new ProductVariation();
large.name = "1kg";
large.price = 280.0;
large.weight = 1000;

@Component({
  selector: "app-order-edit",
  templateUrl: "./order-edit.component.html",
  styleUrls: ["./order-edit.component.scss"]
})
export class OrderEditComponent implements OnInit {
  orderItem: OrderItem;
  stashOrderItem: OrderItem;
  order: Order;
  note: OrderNote;
  isSubscriptionParent: boolean;
  isEditMode: Boolean; // edit or new order

  constructor(
    public dialogRef: MatDialogRef<OrderEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderData
  ) {}

  ngOnInit() {
    this.initOrder();
    this.initOrderItem();
    this.initStashOrderItem();
    this.note = new OrderNote();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initOrder() {
    if (!this.data.order) {
      this.data.order = new Order();
      this.order = this.data.order;
      this.order.customer = this.data.customers[0];
      this.order.items = new Array<OrderItem>();
      this.order.notes = new Array<OrderNote>();
      this.isEditMode = false;
    } else {
      this.order = this.data.order;
      this.isEditMode = true;
    }
  }

  initOrderItem() {
    this.orderItem = new OrderItem();
    this.orderItem.product = this.data.products[0];
    this.orderItem.productVariation = this.getCoffeeProductVariations[0];
    this.orderItem.quantity = 1;
    this.orderItem.price = this.orderItem.productVariation.price;
  }

  initStashOrderItem() {
    this.stashOrderItem = new OrderItem();
    this.stashOrderItem.product = new Product();
    this.stashOrderItem.product.vatGroup = "standard";
    this.stashOrderItem.product.category = "stash";
    this.stashOrderItem.productVariation = new ProductVariation();
    this.stashOrderItem.quantity = 1;
  }

  createSubscriptionData() {
    const data = new SubscriptionData();
    data.frequence = 1;
    data.status = "active";
    return data;
  }

  addCoffee() {
    let productAdded = this.order.items.find(i => {
      return (
        i.product.id === this.orderItem.product.id &&
        i.productVariation.name == this.orderItem.productVariation.name &&
        i.productVariation.price == this.orderItem.price
      );
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

  removeOrderItem(item: OrderItem) {
    const index = this.order.items.findIndex(i => {
      return (
        i.product.id === item.product.id &&
        i.productVariation.name == item.productVariation.name &&
        i.productVariation.price == item.price
      );
    });

    if (index >= 0) {
      this.order.items.splice(index, 1);
    }
  }

  addNote() {
    const newNote = new OrderNote();
    newNote.date = new Date();
    newNote.note = this.note.note;

    this.order.notes.push(newNote);

    this.note = new OrderNote();
  }

  onProductVariationChange(productVariation: ProductVariation) {
    this.orderItem.price = productVariation.price;
  }

  onIsSubscriptionChanged() {
    this.order.subscriptionData = this.isSubscriptionParent
      ? this.createSubscriptionData()
      : null;
  }

  get getCoffeeProductVariations() {
    return [small, large];
  }

  get isOrderValid() {
    return this.order && this.order.customer && this.order.items.length > 0;
  }

  resolveCoffeeProductName(product: Product) {
    if (!product) {
      return "";
    }

    if (product.category === "coffee") {
      return `${product.data.country} - ${product.data.name} (${
        product.data.code
      })`;
    }
    return product.data.name;
  }

  resolveProductVariationString(variation: ProductVariation) {
    return !variation
      ? ""
      : variation.name + " - Normalpris: " + variation.price + " kr";
  }
}
