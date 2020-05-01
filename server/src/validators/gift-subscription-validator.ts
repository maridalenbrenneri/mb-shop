import { ValidationError } from "../models/validation-error";
import * as moment from "moment";

export class GiftSubscriptionValidator {
  static validate(giftSubscription) {
    if (!giftSubscription) {
      throw new ValidationError();
    }

    GiftSubscriptionValidator.validateFirstDeliveryDate(
      giftSubscription.firstDeliveryDate
    );
  }

  static validateFirstDeliveryDate(date: Date) {
    if (!moment(date).isValid()) {
      throw new ValidationError("Invalid first delivery date");
    }
  }
}
