/*
 * SETTINGS
 */
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

/*
 * OTHER CONSTANTS
 */
export class Constants {
  public static readonly deliveryDay = 1; // Monday
  public static readonly minPasswordLength = 5;
  static readonly smallBagFreightWeight = 300;
}

export class CoffeeSizes {
  public static readonly _250 = 250;
  public static readonly _500 = 500;
  public static readonly _1200 = 1200;
}

export class OrderStatus {
  public static readonly created = "created";
  public static readonly processing = "processing";
  public static readonly completed = "completed";
  public static readonly canceled = "canceled";
}

// SERVER
export class ProductCategories {
  static readonly coffee = "coffee";
  static readonly coffeeSubscription = "coffee-subscription";
  static readonly coffeeGiftSubscription = "coffee-gift-subscription";
}

export class OrderTypes {
  static readonly normal = "normal";
  static readonly renewal = "renewal";
}

export class SubscriptionFrequence {
  static readonly monthly = 1;
  static readonly fortnightly = 2;
}

export class SubscriptionStatus {
  static readonly active = "active";
  static readonly onHold = "on-hold";
  static readonly pendingCancel = "pending-cancel";
  static readonly cancelled = "cancelled";
}
