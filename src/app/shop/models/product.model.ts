import { DecimalPipe } from "@angular/common";

export class PriceVariation {
    name: string;
    price: number;
}

export class Product {
    id: number;
    category: string;
    data: any;
    priceVariations: Array<PriceVariation>;
    vatGroup: string;
    portfolioImageKey: string;
    isActive: boolean;
    isInStock: boolean;
}
