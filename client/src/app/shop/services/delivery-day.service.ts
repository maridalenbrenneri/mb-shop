import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { DeliveryDay } from "../models/delivery-day.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class DeliveryDayService {
  deliveryDays: Array<DeliveryDay> = [];

  constructor(private http: HttpClient) {}

  updateDeliveryDay(deliveryDay: DeliveryDay): Observable<any> {
    return this.http.put<any>(
      `${environment.mbApiBaseUrl}deliverydays/${deliveryDay.id}`,
      deliveryDay
    );
  }

  getDeliveryDays(): Observable<DeliveryDay[]> {
    return this.http
      .get<DeliveryDay[]>(`${environment.mbApiBaseUrl}deliverydays`)
      .pipe(
        map(deliveryDays => {
          this.deliveryDays = deliveryDays;
          return this.deliveryDays;
        })
      );
  }
}
