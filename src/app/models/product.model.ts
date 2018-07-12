export class Product {
    id: number;
    name: string;
    shortDescription: string;
    price: number;

    // singleQuantityOnly
    // type - coffee, subscription
}

export class ProductItem {
    product: Product;
    quantity: number;
}