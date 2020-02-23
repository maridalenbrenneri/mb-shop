import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  stats: any;
  statsLastUpdated: Date;
  isUpdating: boolean = false;
  orderStats: any;
  deliveryDays: any[];
  coffees: any[];
  subscriptionCoffeeTypeCounter: any;
  coffeesNotSet: any[] = [];
  coffeeIsNotSet: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.warn("Environment is PRODUCTION: " + environment.production);

    this.http
      .get<any>(environment.mbApiBaseUrl + "aboabo/stats")
      .subscribe(stats => {
        this.stats = stats.data;
        this.statsLastUpdated = stats.lastUpdated;
      });

    this.http
      .get<any>(environment.mbApiBaseUrl + "stats/coffees")
      .subscribe(res => {
        this.coffees = res;
      });

    this.http
      .get<any>(environment.mbApiBaseUrl + "stats/orders")
      .subscribe(res => {
        this.orderStats = res;
      });

    this.http
      .get<any>(environment.mbApiBaseUrl + "stats/deliverydays")
      .subscribe(res => {
        this.deliveryDays = res;
      });

    this.http
      .get<any>(
        environment.mbApiBaseUrl + "stats/subscriptionCoffeeTypeCounter"
      )
      .subscribe(res => {
        this.subscriptionCoffeeTypeCounter = res;
      });
  }

  hasNextDeliveryDayCoffeesSet = () => {
    if (!this.deliveryDays || !this.deliveryDays.length) return false;

    return (
      this.deliveryDays[0].coffee1 &&
      this.deliveryDays[0].coffee2 &&
      this.deliveryDays[0].coffee3 &&
      this.deliveryDays[0].coffee4
    );
  };

  resolveCoffeeCodeFromId = id => {
    const coffee = this.coffees.find(c => c.id === id);
    if (!coffee) return "Not set";
    return coffee.code;
  };

  resolveCoffeeANY(day: any) {
    const coffeeAnyId = 1;

    const any250 = day.quantities.coffeeItems._250s.find(i => {
      return i.id === coffeeAnyId;
    }) || { quantity: 0 };

    const any500 = day.quantities.coffeeItems._500s.find(i => {
      return i.id === coffeeAnyId;
    }) || { quantity: 0 };

    const any1000 = day.quantities.coffeeItems._1000s.find(i => {
      return i.id === coffeeAnyId;
    }) || { quantity: 0 };

    const totalGrams =
      any250.quantity > 0
        ? any250.quantity * 250
        : 0 + any500.quantity > 0
        ? any500.quantity * 500
        : 0 + any1000.quantity > 0
        ? any1000.quantity * 1000
        : 0;

    return {
      count250: any250.quantity,
      count500: any500.quantity,
      count1000: any1000.quantity,
      total: totalGrams / 1000
    };
  }

  resolveCoffee(day: any, coffeeField: string) {
    if (!day[coffeeField]) {
      // TODO: do something smart...
    }

    const mbOrders250 = day.quantities.coffeeItems._250s.find(i => {
      return i.id === day[coffeeField];
    }) || { quantity: 0 };

    const mbOrders500 = day.quantities.coffeeItems._500s.find(i => {
      return i.id === day[coffeeField];
    }) || { quantity: 0 };

    const mbOrders1000 = day.quantities.coffeeItems._1000s.find(i => {
      return i.id === day[coffeeField];
    }) || { quantity: 0 };

    const mbOrdersTotalWeight =
      mbOrders250.quantity > 0
        ? mbOrders250.quantity * 250
        : 0 + mbOrders500.quantity > 0
        ? mbOrders500.quantity * 500
        : 0 + mbOrders1000.quantity > 0
        ? mbOrders1000.quantity * 1000
        : 0;

    if (day.type === "normal") {
      return {
        count250: mbOrders250.quantity,
        count500: mbOrders500.quantity,
        count1000: mbOrders1000.quantity,
        total: mbOrdersTotalWeight / 1000
      };
    }

    // If abo delivery day, add all abo small bags

    const abo250count =
      day.type === "monthly"
        ? this.subscriptionCoffeeTypeCounter.bigAbo[coffeeField]
        : this.subscriptionCoffeeTypeCounter.smallAbo[coffeeField];

    const aggregated250 = abo250count + mbOrders250.quantity;

    const totalWeight =
      aggregated250 > 0
        ? aggregated250 * 250
        : 0 + mbOrders500.quantity > 0
        ? mbOrders500.quantity * 500
        : 0 + mbOrders1000.quantity > 0
        ? mbOrders1000.quantity * 1000
        : 0;

    return {
      count250: aggregated250,
      count500: mbOrders500.quantity,
      count1000: mbOrders1000.quantity,
      total: totalWeight / 1000
    };
  }

  resolveDeliveryTypeString(type) {
    if (type === "monthly") return "Stor-abo";
    if (type === "fortnightly") return "Lill-abo";
    return "Normal";
  }

  resolveCoffeTypeCountString(type: string, coffeeKey: string) {
    const count = this.subscriptionCoffeeTypeCounter[type][coffeeKey];
    const kg = (count * 250) / 1000;
    return `${count} / ${kg}kg`;
  }

  updateStats() {
    this.isUpdating = true;
    this.http
      .get<any>(environment.mbApiBaseUrl + "aboabo/import")
      .subscribe(stats => {
        this.stats = stats.data;
        this.statsLastUpdated = stats.lastUpdated;
        this.isUpdating = false;
      });
  }
}
