export class Coffee {
  id: number;
  code: string;
  name: string;
  country: string;
  isActive: boolean;
  isInStock: boolean;
}

export interface CoffeeVariation {
  id: number;
  name: string;
  price: number;
  size: number;
}
