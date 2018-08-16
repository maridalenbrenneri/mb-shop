import { Product } from './product.model';
import { Address } from './address.model';

export class Order {
    id: number;
    customer: OrderCustomer;
    items: Array<OrderItem>;
}

export class OrderCustomer {
    userId: number;
    givenName: string;
    familyName: string;
    email: string;
    phone: string;
}

export class OrderItem {
    product: Product;
    quantity: number;
    subscriptionOptions: SubscriptionOrderOptions;
}

export class SubscriptionOrderOptions {
    frequence: string;
    quantity: number;
    firstDelivery: Date;
    immediateDelivery: boolean;
}
