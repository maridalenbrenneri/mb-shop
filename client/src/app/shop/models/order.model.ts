import { Product, ProductVariation } from "./product.model";
import { Customer } from "./customer.model";
import { SubscriptionData } from "./subscription-data.model";

export class Order {
  id: number;
  status: string;
  orderDate: Date;
  deliveryDate: Date;
  customer: Customer;
  items: Array<OrderItem>;
  notes: Array<any>;
  subscriptionParentOrderId: number; // is renewal order, this id referes to parent subscription order
  subscriptionData: SubscriptionData; // if set, order is a parent subscription
}

export class OrderItem {
  product: Product;
  productVariation: ProductVariation;
  productOptions: any;
  quantity: number;
  price: number; // from variation or custom
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
