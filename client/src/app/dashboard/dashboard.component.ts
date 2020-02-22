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
