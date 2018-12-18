import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GiftSubscription } from '../models/gift-subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiftSubscriptionService {
  constructor(private http: HttpClient) { }

  getSubscriptions(): Observable<GiftSubscription[]> {

    return this.http.get<GiftSubscription[]>(environment.mbApiBaseUrl + 'giftsubscriptions');
  }

  createOrder(subscription: GiftSubscription): any {
    
    // todo: in later version, this should call some create order endpoint, not shipping directly

    return this.http.post<GiftSubscription[]>(environment.mbApiBaseUrl + 'shipping/ship-gift-subscription', subscription);
  }

  import(): Observable<any> {
    return this.http.post<any>(environment.mbApiBaseUrl + 'giftsubscriptions/import', null);
  }
}
