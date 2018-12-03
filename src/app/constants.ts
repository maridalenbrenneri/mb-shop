export class Constants {
    static deliveryDay = 2; // Tuesday
    static subscriptionRenewalPaymentDaysBeforeDelivery = 14;
    static minPasswordLength = 5;
}

export class TaxRates {
    static coffee = 0.15;
    static standard = 0.25;
}

export class FreightRates {
    static standard = 40;
    static standard_subscription = 30;
}

export class ProductCategories {
    static coffee = 'coffee';
    static coffeeSubscription = 'coffee-subscription';
    static coffeeGiftSubscription = 'coffee-gift-subscription';
}

export class OrderTypes {
    static normal: 'normal';
    static renewal: 'renewal';
}

export class OrderStatus {
    static created: 'created';
    static processing: 'processing';
    static completed: 'completed';
    static canceled: 'canceled';
}

export class SubscriptionFrequence {
    static monthly = 1;
    static fortnightly = 2;
}