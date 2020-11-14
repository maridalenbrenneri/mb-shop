import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GiftSubscription } from '../models/gift-subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GiftSubscriptionService {
  constructor(private http: HttpClient) {}

  getSubscriptions(): Observable<GiftSubscription[]> {
    return this.http.get<GiftSubscription[]>(
      environment.mbApiBaseUrl + 'giftsubscriptions'
    );
  }

  createOrders(subscriptions: GiftSubscription[]): any {
    return this.http.post<GiftSubscription[]>(
      environment.mbApiBaseUrl + 'shipping/ship-gift-subscriptions',
      subscriptions
    );
  }
}
