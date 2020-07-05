import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import * as moment from "moment";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  stats: any;
  statsLastUpdated: Date;
  dataLastLoaded: Date;
  isUpdating: boolean = false;
  orderStats: any;
  deliveryDays: any[];
  coffees: any[];
  subscriptionCoffeeTypeCounter: any;
  coffeesNotSet: any[] = [];
  coffeeIsNotSet: boolean = false;
  statsData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.warn("Environment is PRODUCTION: " + environment.production);

    this.loadData(this);

    // Reload data every 5 minutes
    setInterval(() => this.loadData(this), 60 * 1000 * 5);
  }

  loadData(self: DashboardComponent) {
    self.http
      .get<any>(environment.mbApiBaseUrl + "stats/data")
      .subscribe((res) => {
        self.statsData = res;
      });

    self.http
      .get<any>(environment.mbApiBaseUrl + "stats/coffees")
      .subscribe((res) => {
        self.coffees = res;
      });

    self.http
      .get<any>(environment.mbApiBaseUrl + "stats/orders")
      .subscribe((res) => {
        this.orderStats = res;
      });

    self.http
      .get<any>(environment.mbApiBaseUrl + "stats/deliverydays")
      .subscribe((res) => {
        self.deliveryDays = res;
      });

    self.http
      .get<any>(
        environment.mbApiBaseUrl + "stats/subscriptionCoffeeTypeCounter"
      )
      .subscribe((res) => {
        self.subscriptionCoffeeTypeCounter = res;
      });

    self.dataLastLoaded = moment().toDate();
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

  resolveCoffeeCodeFromId = (id) => {
    const coffee = this.coffees.find((c) => c.id === id);
    if (!coffee) return "Not set";
    return coffee.code;
  };

  resolveCoffeesForNonAboDay() {
    const result = [];

    this.coffees.map((coffee) => {
      const mbOrders250 = this.orderStats.quantities._250s.find((i) => {
        return i.id === coffee.id;
      }) || { quantity: 0 };

      const mbOrders500 = this.orderStats.quantities._500s.find((i) => {
        return i.id === coffee.id;
      }) || { quantity: 0 };

      const mbOrders1200 = this.orderStats.quantities._1200s.find((i) => {
        return i.id === coffee.id;
      }) || { quantity: 0 };

      const mbOrdersTotalWeight =
        (mbOrders250.quantity > 0 ? mbOrders250.quantity * 250 : 0) +
        (mbOrders500.quantity > 0 ? mbOrders500.quantity * 500 : 0) +
        (mbOrders1200.quantity > 0 ? mbOrders1200.quantity * 1200 : 0);

      let count250 = 0;
      const c = this.statsData.coffeesInActiveNonAboOrders[coffee.code];
      if (c) {
        count250 += this.statsData.coffeesInActiveNonAboOrders[coffee.code];
      }

      result.push({
        code: coffee.code,
        count250: count250 + mbOrders250.quantity,
        count500: mbOrders500.quantity,
        count1200: mbOrders1200.quantity,
        total: (count250 * 250 + mbOrdersTotalWeight) / 1000,
      });
    });

    return result;
  }

  resolveCoffee(day: any, coffeeField: string) {
    if (!day[coffeeField]) {
      // TODO: do something smart
      console.log("WARNING - coffee is not set on delivery day");
    }

    // This is only for abo delivery days

    if (day.type === "normal") return null;

    const mbOrders250 = day.quantities.coffeeItems._250s.find((i) => {
      return i.id === day[coffeeField];
    }) || { quantity: 0 };

    const mbOrders500 = day.quantities.coffeeItems._500s.find((i) => {
      return i.id === day[coffeeField];
    }) || { quantity: 0 };

    const mbOrders1200 = day.quantities.coffeeItems._1200s.find((i) => {
      return i.id === day[coffeeField];
    }) || { quantity: 0 };

    const abo250count =
      day.type === "monthly"
        ? this.subscriptionCoffeeTypeCounter.bigAbo[coffeeField]
        : this.subscriptionCoffeeTypeCounter.smallAbo[coffeeField];

    const aggregated250 = abo250count + mbOrders250.quantity;

    const totalWeight =
      (aggregated250 > 0 ? aggregated250 * 250 : 0) +
      (mbOrders500.quantity > 0 ? mbOrders500.quantity * 500 : 0) +
      (mbOrders1200.quantity > 0 ? mbOrders1200.quantity * 1200 : 0);

    return {
      count250: aggregated250,
      count500: mbOrders500.quantity,
      count1200: mbOrders1200.quantity,
      total: totalWeight / 1000,
    };
  }

  getCargonizerProfile() {
    if (!this.statsData.cargonizerProfile) return {};

    return this.statsData.cargonizerProfile.user.managerships.managership.sender
      .plan;
  }

  getTotalKgs() {
    return Math.round(this.deliveryDays[0].quantities.totalWeight);
  }

  resolveDeliveryTypeString(type: string) {
    if (type === "monthly") return "Stor-abo";
    if (type === "fortnightly") return "Lill-abo";
    return "Kun enkeltordre";
  }

  activeCoffees() {
    if (!this.coffees) return [];
    return this.coffees.filter((c) => c.id > 1); // exclude ANY
  }

  resolveCoffeTypeCountString(type: string, coffeeKey: string) {
    const count = this.subscriptionCoffeeTypeCounter[type][coffeeKey];
    const kg = (count * 250) / 1000;
    return `${count} / ${kg}kg`;
  }

  resolveCoffeesInActiveOrdersString() {
    return JSON.stringify(this.statsData.coffeesInActiveNonAboOrders);
  }

  updateStats() {
    this.isUpdating = true;
    this.http
      .get<any>(environment.mbApiBaseUrl + "woo/import")
      .subscribe(() => {
        this.loadData(this);
        this.isUpdating = false;
      });
  }
}
