import { Product, PriceVariation } from './product.model';
import { Address } from './address.model';
import { Customer } from './customer.model';

export class Order {
    id: number;
    type: string;
    customer: Customer;
    items: Array<OrderItem>;
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
    productVariation: PriceVariation;
    productOptions: any;
    quantity: number;
}

export class SubscriptionProductOptions {
    frequence: string;
    quantity: number;
    firstDelivery: Date;
    immediateDelivery: boolean;
}
