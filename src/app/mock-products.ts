import { Product, SubscriptionProduct, GiftSubscriptionProduct, CoffeeNormalProduct } from './models/product.model';

// product types: coffee-normal, subscription, gift-subscription

const subscription = new SubscriptionProduct();
subscription.id = 11;
subscription.name = 'Kaffeabonnement';
subscription.price = 90;
subscription.image = 'product_abo.jpg';

const giftSubscription = new GiftSubscriptionProduct();
giftSubscription.id = 12;
giftSubscription.name = 'Gaveabonnement';
giftSubscription.price = 90;
giftSubscription.image = 'product_gave_abo.png';

const coffee1 = new CoffeeNormalProduct();
coffee1.id = 13;
coffee1.name = 'Guatemala (GT) – El Bosque';
coffee1.price = 90;
coffee1.shortDescription = 'Sjukt gott kaffe alltså... :D';
coffee1.tastes = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee1.image = 'product_default.jpg';

const coffee2 = new CoffeeNormalProduct();
coffee2.id = 14;
coffee2.name = 'Kenya (KE) – El Bosque';
coffee2.price = 90;
coffee2.shortDescription = 'Sjukt gott kaffe alltså... :D';
coffee2.tastes = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee2.image = 'product_default.jpg';

const coffee3 = new CoffeeNormalProduct();
coffee3.id = 15;
coffee3.name = 'Etiopa (ET) – El Bosque';
coffee3.price = 90;
coffee3.shortDescription = 'Sjukt gott kaffe alltså... :D';
coffee3.tastes = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee3.image = 'product_default.jpg';

const coffee4 = new CoffeeNormalProduct();
coffee4.id = 16;
coffee4.name = 'Colombia (CO) – El Bosque';
coffee4.price = 90;
coffee4.shortDescription = 'Sjukt gott kaffe alltså... :D';
coffee4.tastes = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee4.image = 'product_default.jpg';

export const PRODUCTS: Product [] = [
  subscription,
  giftSubscription,
  coffee1, coffee2, coffee3, coffee4
];
