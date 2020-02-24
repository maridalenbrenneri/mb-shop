import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { Subscription } from "../models/subscription.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SubscriptionService {
  subscriptions: Array<Subscription>;

  constructor(private http: HttpClient) {}

  createSubscription(subscription: Subscription): Observable<any> {
    return this.http.post<any>(
      `${environment.mbApiBaseUrl}subscriptions`,
      subscription
    );
  }

  updateSubscription(subscription: Subscription): Observable<any> {
    return this.http.put<any>(
      `${environment.mbApiBaseUrl}subscriptions/${subscription.id}`,
      subscription
    );
  }

  getSubscription(id: number): Observable<Subscription> {
    const subscriptions = this.subscriptions.find(p => p.id === id);
    if (!subscriptions) {
      return of(subscriptions);
    }

    return this.http.get<Subscription>(
      `${environment.mbApiBaseUrl}subscriptions/${id}`
    );
  }

  getSubscriptions(): Observable<Subscription[]> {
    return this.http
      .get<Subscription[]>(`${environment.mbApiBaseUrl}subscriptions`)
      .pipe(
        map(subscriptions => {
          this.subscriptions = subscriptions;
          return this.subscriptions;
        })
      );
  }
}
