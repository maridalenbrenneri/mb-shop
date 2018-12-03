export class ProductVariation {
    name: string;
    price: number;
}

export class Product {
    id: number;
    category: string;
    data: any;
    productVariations: Array<ProductVariation>;
    vatGroup: string;
    portfolioImageKey: string;
    isActive: boolean;
    isInStock: boolean;
}
