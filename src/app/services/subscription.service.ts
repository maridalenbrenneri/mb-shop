import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  getSubscriptions(filter: any) {
    return this.http.get<any>(`${environment.mbApiBaseUrl}subscriptions`);
  }

  getMySubscriptions() {
    return this.http.get<any>(`${environment.mbApiBaseUrl}subscriptions/mine`);
  }

  activateSubscription(subscriptionId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}subscriptions/${subscriptionId}/activate`, {});
  }

  pauseSubscription(subscriptionId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}subscriptions/${subscriptionId}/pause`, {});
  }

  cancelSubscription(subscriptionId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}subscriptions/${subscriptionId}/cancel`, {});
  }

  completeCancelSubscription(subscriptionId: number) {
    return this.http.post<any>(`${environment.mbApiBaseUrl}subscriptions/${subscriptionId}/complete-cancel`, {});
  }

  getNextDeliveryDates(): Observable<any> {
    return this.http.get<any>(`${environment.mbApiBaseUrl}subscriptions/data/delivery-dates`);
  }
}
