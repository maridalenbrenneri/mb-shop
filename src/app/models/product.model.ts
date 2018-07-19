export class Product {
    id: number;
    name: string;
    shortDescription: string;
    price: number;

    image: string;
    
    // singleQuantityOnly
    // type - coffee, subscription
}

export class ProductItem {
    product: Product;
    quantity: number;
}