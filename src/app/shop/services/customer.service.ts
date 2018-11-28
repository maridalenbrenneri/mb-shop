import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  createCustomer( customer: Customer): Observable<any> {
    return this.http.post<any>(`${environment.mbApiBaseUrl}customers`, customer);
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put<any>(`${environment.mbApiBaseUrl}customers/${customer.id}`, customer);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.mbApiBaseUrl}customers/${id}`);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.mbApiBaseUrl + 'customers');
  }
}
