import { Product, ProductVariation } from './product.model';
import { Customer } from './customer.model';

export class Order {
    id: number;
    type: string;
    orderDate: Date;
    deliveryDate: Date;
    customer: Customer;
    items: Array<OrderItem>;
    notes: Array<any>;
    isRecurringOrder: boolean;
    subscriptionId: number;
}

export class OrderCustomer {
    userId: number;
    givenName: string;
    familyName: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirm: string;
}

export class OrderItem {
    product: Product;
    productVariation: ProductVariation;
    productOptions: any;
    quantity: number;
}

export class SubscriptionProductOptions {
    frequence: string;
    quantity: number;
    firstDelivery: Date;
    immediateDelivery: boolean;
}
