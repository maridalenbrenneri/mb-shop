import { Component, OnInit, Input } from "@angular/core";
import { Order, CoffeeItem } from "src/app/shop/models/order.model";
import { VatRates } from "src/app/constants";
import { resolveCoffeeVariation } from "../coffee-variations";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"]
})
export class OrderDetailsComponent implements OnInit {
  _order: Order;

  constructor() {}

  ngOnInit() {}

  get order() {
    return this._order;
  }

  @Input()
  set order(order: Order) {
    this._order = order;
  }

  get getTotalPrice(): number {
    if (!this.order.coffeeItems) {
      return 0;
    }

    let total = 0;
    this.order.coffeeItems.forEach(i => {
      total += resolveCoffeeVariation(i.variationId).price * i.quantity;
    });
    return total;
  }

  getVatFromItem(item: CoffeeItem) {
    return VatRates.coffee * 100;
  }

  get getTotalVatCoffee(): number {
    return this.calculateTotalVat("coffee");
  }

  get getTotalVatStandard(): number {
    return this.calculateTotalVat("standard");
  }

  get isOrderCreated(): boolean {
    return this.order.id > 0;
  }

  removeItem(item: CoffeeItem) {
    const index = this.order.coffeeItems.findIndex(i => {
      return (
        i.coffee.id === item.coffee.id && i.variationId == item.variationId
      );
    });

    if (index >= 0) {
      this.order.coffeeItems.splice(index, 1);
    }
  }

  getProductNameString(item: CoffeeItem) {
    return `${item.coffee.code} ${
      resolveCoffeeVariation(item.variationId).name
    }`;
  }

  private calculateTotalVat(vatGroup: string) {
    if (!this.order.coffeeItems) return 0;

    let total = 0;
    this.order.coffeeItems.forEach(i => {
      total +=
        resolveCoffeeVariation(i.variationId).price *
        i.quantity *
        VatRates.coffee;
    });

    return total;
  }
}
