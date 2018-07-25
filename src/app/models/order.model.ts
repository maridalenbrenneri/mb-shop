import { Product } from "./product.model";
import { Address } from "./address.model";

export class Order {
    id: number;
    customer: OrderCustomer;
    products: Array<OrderItem>;
}

export class OrderCustomer {
    userId: string;
    givenName: string;
    familyName: string;
    email: string;
    phone: string;
    address: Address;
    deliveryAddress: Address;
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