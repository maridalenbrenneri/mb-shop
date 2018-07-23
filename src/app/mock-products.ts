import { Product, SubscriptionProduct, GiftSubscriptionProduct, CoffeeNormalProduct } from './models/product.model';

// product types: coffee-normal, subscription, gift-subscription

let subscription = new SubscriptionProduct();
subscription.id = 11;
subscription.name = 'Kaffeabonnement';
subscription.price = 90;
subscription.image = 'product_abo.jpg';

let giftSubscription = new GiftSubscriptionProduct();
giftSubscription.id = 12;
giftSubscription.name = 'Gaveabonnement';
giftSubscription.price = 90;
giftSubscription.image = 'product_abo.jpg';
// shortDescription: 'Overraske en venn med nybrent kaffe fra Maridalen Brenneri levert helt hjem.', 

let coffee1 = new CoffeeNormalProduct();
coffee1.id = 13;
coffee1.name = 'Guatemala (GT) – El Bosque';
coffee1.price = 90;
coffee1.shortDescription = 'Sjukt gott kaffe alltså... :D';
coffee1.tastes = 'Bringebær | Nektarin | Pasjonsfrukt | Floral';
coffee1.image = 'product_default.jpg';

let coffee2 = new CoffeeNormalProduct();
coffee2.id = 14;
coffee2.name = 'Guatemala (GT) – El Bosque';
coffee2.price = 90;

let coffee3 = new CoffeeNormalProduct();
coffee3.id = 15;
coffee3.name = 'Guatemala (GT) – El Bosque';
coffee3.price = 90;

export const PRODUCTS: Product [] = [
  subscription,
  giftSubscription,
  coffee1
];