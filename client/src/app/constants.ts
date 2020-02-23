export class Constants {
  public static readonly deliveryDay = 1; // Monday
  public static readonly subscriptionRenewalPaymentDaysBeforeDelivery = 14;
  public static readonly minPasswordLength = 5;
}

export class CoffeeSizes {
  public static readonly _250 = 250;
  public static readonly _500 = 500;
  public static readonly _1200 = 1200;
}

export class CoffeePrizes {
  public static readonly _250 = 70;
  public static readonly _500 = 140;
  public static readonly _1200 = 336;
}

export class VatRates {
  public static readonly coffee = 0.15;
  public static readonly standard = 0.25;
}

export class FreightRates {
  public static readonly standard = 40;
  public static readonly standard_subscription = 30;
}

export class ProductCategories {
  public static readonly coffee = "coffee";
  public static readonly coffeeSubscription = "coffee-subscription";
  public static readonly coffeeGiftSubscription = "coffee-gift-subscription";
}

export class OrderTypes {
  public static readonly normal = "normal";
  public static readonly renewal = "renewal";
}

export class OrderStatus {
  public static readonly created = "created";
  public static readonly processing = "processing";
  public static readonly completed = "completed";
  public static readonly canceled = "canceled";
}

export class SubscriptionFrequence {
  public static readonly monthly = 1;
  public static readonly fortnightly = 2;
}
