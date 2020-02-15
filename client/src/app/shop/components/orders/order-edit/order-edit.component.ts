import { Component, OnInit, Inject } from "@angular/core";
import {
  Order,
  OrderNote,
  CoffeeItem,
  StashItem
} from "../../../models/order.model";
import { Customer } from "../../../models/customer.model";
import { ProductVariation } from "../../../models/product.model";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SubscriptionData } from "src/app/shop/models/subscription-data.model";
import { Coffee } from "src/app/shop/models/coffee.model";
import {
  getCoffeeVariations,
  resolveCoffeeVariation
} from "../coffee-variations";

export interface OrderData {
  order: Order;
  customers: Array<Customer>;
  coffees: Array<Coffee>;
  stash: Array<any>;
}

@Component({
  selector: "app-order-edit",
  templateUrl: "./order-edit.component.html",
  styleUrls: ["./order-edit.component.scss"]
})
export class OrderEditComponent implements OnInit {
  orderItem: CoffeeItem;
  stashOrderItem: StashItem;
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
    this.initCoffeeItem();
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
      this.order.coffeeItems = new Array<CoffeeItem>();
      this.order.notes = new Array<OrderNote>();
      this.isEditMode = false;
    } else {
      this.order = this.data.order;
      this.isEditMode = true;
    }
  }

  initCoffeeItem() {
    this.orderItem = new CoffeeItem();
    this.orderItem.coffee = this.data.coffees[0];
    this.orderItem.variationId = 1;
    this.orderItem.quantity = 1;
    this.orderItem.price = resolveCoffeeVariation(
      this.orderItem.variationId
    ).price;
  }

  initStashOrderItem() {
    this.stashOrderItem = new StashItem();
  }

  createSubscriptionData() {
    const data = new SubscriptionData();
    data.frequence = 1;
    data.status = "active";
    return data;
  }

  addCoffee() {
    let productAdded = this.order.coffeeItems.find(i => {
      return (
        i.coffee.id === this.orderItem.coffee.id &&
        i.variationId === this.orderItem.variationId
      );
    });

    if (!productAdded) {
      this.order.coffeeItems.push(this.orderItem);
    } else {
      productAdded.quantity += this.orderItem.quantity;
    }

    this.initCoffeeItem();
  }

  addStash() {
    // this.order.items.push(this.stashOrderItem);
    // this.initStashOrderItem();
  }

  removeCoffeerItem(item: CoffeeItem) {
    const index = this.order.coffeeItems.findIndex(i => {
      return (
        i.coffee.id === item.coffee.id && i.variationId === item.variationId
      );
    });

    if (index >= 0) {
      this.order.coffeeItems.splice(index, 1);
    }
  }

  addNote() {
    const newNote = new OrderNote();
    newNote.date = new Date();
    newNote.note = this.note.note;

    this.order.notes.push(newNote);

    this.note = new OrderNote();
  }

  onProductVariationChange(variationId: number) {
    this.orderItem.variationId = variationId;
    this.orderItem.price = resolveCoffeeVariation(variationId).price;
  }

  onIsSubscriptionChanged() {
    // this.order.subscriptionData = this.isSubscriptionParent
    //   ? this.createSubscriptionData()
    //   : null;
  }

  get getCoffeeProductVariations() {
    return getCoffeeVariations();
  }

  get isOrderValid() {
    return (
      this.order && this.order.customer && this.order.coffeeItems.length > 0
    );
  }

  resolveCoffeeProductName(coffee: Coffee) {
    if (!coffee) return "";
    return `${coffee.code} - ${coffee.name} - ${coffee.country}`;
  }

  resolveProductVariationString(variation: ProductVariation) {
    return !variation
      ? ""
      : variation.name + " - Normalpris: " + variation.price + " kr";
  }
}
