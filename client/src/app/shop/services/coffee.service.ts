import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { Coffee } from "../models/coffee.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CoffeeService {
  coffees: Array<Coffee> = [];

  constructor(private http: HttpClient) {}

  createCoffee(coffee: Coffee): Observable<any> {
    return this.http.post<any>(`${environment.mbApiBaseUrl}coffees`, coffee);
  }

  updateCoffee(coffee: Coffee): Observable<any> {
    return this.http.put<any>(
      `${environment.mbApiBaseUrl}coffees/${coffee.id}`,
      coffee
    );
  }

  getCoffee(id: number): Observable<Coffee> {
    const coffee = this.coffees.find(p => p.id === id);
    if (!coffee) {
      return of(coffee);
    }

    return this.http.get<Coffee>(`${environment.mbApiBaseUrl}coffees/${id}`);
  }

  getCoffees(): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(`${environment.mbApiBaseUrl}coffees`).pipe(
      map(coffees => {
        this.coffees = coffees;
        return this.coffees;
      })
    );
  }
}
