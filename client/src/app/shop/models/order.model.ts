import { Customer } from "./customer.model";
import { Coffee } from "./coffee.model";

export class Order {
  id: number;
  status: string;
  orderDate: Date;
  customer: Customer;
  coffeeItems: Array<CoffeeItem>;
  stashItems: Array<StashItem>;
  notes: Array<OrderNote>;
}

export class CoffeeItem {
  coffee: Coffee;
  quantity: number;
  variationId: number;
  price: number; // default in variation, but vcan be overriden
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

export class OrderNote {
  orderId: number;
  date: Date;
  note: string;
  user: string;
}
