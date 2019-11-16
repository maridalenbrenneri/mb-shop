/**
 * Replacement for product db
 */

import { IProduct, IProductVariation } from "../../models";

const smallBag: IProductVariation = {
  name: "250g",
  price: 70,
  weight: 250
};

const kgBag: IProductVariation = {
  name: "kg",
  price: 280,
  weight: 1000
};

const coffee: IProduct = {
  id: 1,
  category: "",
  data: {},
  productVariations: [smallBag, kgBag],
  vatGroup: "15",
  isActive: true,
  isInStock: true
};

export const Products: Array<IProduct> = [coffee];
