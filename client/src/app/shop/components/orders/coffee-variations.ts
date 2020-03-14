import { CoffeeVariation } from "../../models/coffee.model";
import { CoffeePrizes, CoffeeSizes } from "../../../../../../shared/constants";

const _250: CoffeeVariation = {
  id: 1,
  name: "250gr",
  price: CoffeePrizes._250,
  size: CoffeeSizes._250
};

const _500: CoffeeVariation = {
  id: 2,
  name: "500gr",
  price: CoffeePrizes._500,
  size: CoffeeSizes._500
};

const _1200: CoffeeVariation = {
  id: 3,
  name: "1.2kg",
  price: CoffeePrizes._1200,
  size: CoffeeSizes._1200
};

export const getCoffeeVariations = () => {
  return [_250, _500, _1200];
};

export const resolveCoffeeVariation = (
  variationId: number
): CoffeeVariation => {
  if (variationId === 1) return _250;
  if (variationId === 2) return _500;
  if (variationId === 3) return _1200;

  throw new Error("Coffe variation does not exist");
};
