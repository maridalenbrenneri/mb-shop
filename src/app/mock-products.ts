import { Product } from './models/product.model';

export const PRODUCTS: Product [] = [
  { 
    id: 11, 
    name: 'Kaffeabonnement',
    shortDescription: 'Kaffe på dörren!', 
    price: 90,
    image: "product_abo.jpg"
  },
  { 
    id: 12, 
    name: 'Gaveabonnement',
    shortDescription: 'Overraske en venn med nybrent kaffe fra Maridalen Brenneri levert helt hjem.', 
    price: 90,
    image: "product_abo.jpg"
  },
  { 
    id: 13, 
    name: 'Guatemala (GT) – El Bosque',
    shortDescription: 'Kaffe fra Guatemala', 
    price: 90,
    image: null
  },
  { 
    id: 14, name: 'Honduras (HO)- Danny Moreno', shortDescription: 'Awesome beans', price: 90, image: null 
  },
  {
  id: 15, name: 'Etiopia (ET) – Hunkute kooperativ', shortDescription: 'Epic beans aight', price: 90, image: null 
  }
];