import { Customer } from "./customer.model";
import { Coffee } from "./coffee.model";

export class Order {
  id: number;
  status: string;
  orderDate: Date;
  customer: Customer;
  coffeeItems: Array<CoffeeItem>;
  stashItems: Array<StashItem>;
  notes: string;
  freight: number;
}

export class CoffeeItem {
  coffee: Coffee;
  quantity: number;
  variationId: number;
  price: number; // default in variation, but can be overriden
}

export class StashItem {
  name: string;
  weight: number;
  quantity: number;
  price: number;
}

export class SubscriptionProductOptions {
  frequence: string;
  quantity: number;
  firstDelivery: Date;
  immediateDelivery: boolean;
}
