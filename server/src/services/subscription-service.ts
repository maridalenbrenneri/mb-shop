import { Response } from "express";
import { SubscriptionDateHelper } from "./subscription-date-helper";
import { SubscriptionStatus, ProductCategories } from "../constants";
import { SubscriptionValidator } from "../validators/subscription-validator";

class SubscriptionService {
  getNextDeliveryDates(): any {
    let monthlyList = SubscriptionDateHelper.getNextDeliveryDatesForMonthly().map(
      date => date.format()
    );
    let fortnightlyList = SubscriptionDateHelper.getNextDeliveryDatesForFortnightly().map(
      date => date.format()
    );

    return {
      nextMonthly: SubscriptionDateHelper.getNextDeliveryDateForMonthly().format(),
      nextFortnightly: SubscriptionDateHelper.getNextDeliveryDateForFortnightly().format(),
      nextMonthlyList: monthlyList,
      nextFortnightlyList: fortnightlyList
    };
  }
}

export default new SubscriptionService();
