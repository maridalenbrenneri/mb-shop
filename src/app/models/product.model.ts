export class Product {
    id: number;
    name: string;
    shortDescription: string;
    price: number;
}

export class ProductItem {
    product: Product;
    quantity: number;
}