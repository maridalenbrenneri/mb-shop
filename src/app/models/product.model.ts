export class Product {
    id: number;
    type: string;
    name: string;
    price: number;
    image: string;

    isSubscription() {
       return this instanceof SubscriptionProduct; 
    }
}

export class CoffeeNormalProduct extends Product {
    shortDescription: string;
    tastes: string;
}

export class SubscriptionProduct extends Product {
    
}

export class GiftSubscriptionProduct extends SubscriptionProduct {

}

