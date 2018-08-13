import { Product } from './models/product.model';

// product types: coffee-normal, subscription, gift-subscription

const subscription = new Product();
subscription.id = 11;
subscription.name = 'Kaffeabonnement';
subscription.price = 90;
subscription.imageKey = 'product_abo.jpg';

const giftSubscription = new Product();
giftSubscription.id = 12;
giftSubscription.name = 'Gaveabonnement';
giftSubscription.price = 90;
giftSubscription.imageKey = 'product_gave_abo.png';

const coffee1 = new Product();
coffee1.id = 13;
coffee1.name = 'Guatemala (GT) – El Bosque';
coffee1.price = 90;
coffee1.description = 'Sjukt gott kaffe alltså... :D';
coffee1.description2 = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee1.imageKey = 'product_default.jpg';

const coffee2 = new Product();
coffee2.id = 14;
coffee2.name = 'Kenya (KE) – El Bosque';
coffee2.price = 90;
coffee2.description = 'Sjukt gott kaffe alltså... :D';
coffee2.description2 = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee2.imageKey = 'product_default.jpg';

const coffee3 = new Product();
coffee3.id = 15;
coffee3.name = 'Etiopa (ET) – El Bosque';
coffee3.price = 90;
coffee3.description = 'Sjukt gott kaffe alltså... :D';
coffee3.description2 = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee3.imageKey = 'product_default.jpg';

const coffee4 = new Product();
coffee4.id = 16;
coffee4.name = 'Colombia (CO) – El Bosque';
coffee4.price = 90;
coffee4.description = 'Sjukt gott kaffe alltså... :D';
coffee4.description2 = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee4.imageKey = 'product_default.jpg';

export const PRODUCTS: Product [] = [
  subscription,
  giftSubscription,
  coffee1, coffee2, coffee3, coffee4
];
