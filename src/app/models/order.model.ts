import { ProductItem } from "./product.model";
import { Address } from "./address.model";

export class Order {
    id: number;
    customer: OrderCustomer;
    products: Array<ProductItem>;
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