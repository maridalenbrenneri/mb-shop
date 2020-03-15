export class Constants {
  static readonly deliveryDay = 1; // Monday
  static readonly minPasswordLength = 5;
  static readonly smallBagFreightWeight = 300;
}

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
