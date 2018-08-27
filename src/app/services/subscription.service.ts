import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  getNextDeliveryDates(): Observable<any> {
    return this.http.get<any>(`${environment.mbApiBaseUrl}subscriptions/data/delivery-dates`);
  }
}
