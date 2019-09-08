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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.warn("Environment is PRODUCTION: " + environment.production);

    this.http
      .get<any>(environment.mbApiBaseUrl + "admin/stats")
      .subscribe(stats => {
        this.stats = stats.data;
        this.statsLastUpdated = stats.lastUpdated;
      });
  }

  updateStats() {
    this.isUpdating = true;
    this.http
      .get<any>(environment.mbApiBaseUrl + "admin/importstats")
      .subscribe(stats => {
        this.stats = stats.data;
        this.statsLastUpdated = stats.lastUpdated;

        this.isUpdating = false;
      });
  }
}
