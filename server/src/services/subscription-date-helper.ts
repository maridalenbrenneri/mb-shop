import * as moment from "moment";
import { Constants, SubscriptionFrequence } from "../constants";

export default class SubscriptionDateHelper {
  static getNextDeliveryDays(dateCount: number) {
    const dates = [];
    let date = moment().startOf("day");

    while (dates.length < dateCount) {
      const deliveryDay = date.isoWeekday();
      if (deliveryDay <= Constants.deliveryDay) {
        dates.push({
          date: date.isoWeekday(Constants.deliveryDay).clone(),
          type: this.resolveDeliveryDayType(date)
        });
      }

      date = date.add(1, "weeks").isoWeekday(Constants.deliveryDay);
    }

    return dates;
  }

  static resolveNextDeliveryDate(fromDate: Date, frequency: number): Date {
    return frequency == SubscriptionFrequence.fortnightly
      ? SubscriptionDateHelper.getNextDeliveryDateForFortnightly(fromDate)
      : SubscriptionDateHelper.getNextDeliveryDateForMonthly(fromDate);
  }

  private static resolveDeliveryDayType(date) {
    if (this.isDateMonthlyDeliveryDay(date)) return "monthly";
    if (this.isDateFortnightlyDeliveryDay(date)) return "fortnightly";
    return "normal";
  }

  private static isDateMonthlyDeliveryDay(date) {
    let firstDeliverDateOfMonth = moment(date)
      .startOf("month")
      .day(Constants.deliveryDay);

    if (firstDeliverDateOfMonth.date() > 7) {
      firstDeliverDateOfMonth.add(7, "d");
    }

    return firstDeliverDateOfMonth.isSame(date);
  }

  private static isDateFortnightlyDeliveryDay(date) {
    const dates = this.getAllDatesForDeliverDayInMonth(date);
    if (dates.length < 3) {
      console.warn("Error in date calculation");
      return false;
    }

    return dates[2].isSame(date);
  }

  private static getNextDeliveryDateForMonthly(originDate = null) {
    let origin = !originDate ? moment() : moment(originDate);

    if (!origin.isValid()) {
      throw new Error("Invalid date: " + origin);
    }

    let dates = this.getAllDatesForDeliverDayInMonth(origin);

    if (dates[0].date() <= origin.date()) {
      dates = this.getAllDatesForDeliverDayInMonth(moment(origin).add(1, "M"));
    }

    return dates[0].clone();
  }

  private static getNextDeliveryDateForFortnightly(originDate = null) {
    let origin = !originDate ? moment() : moment(originDate);

    if (!origin.isValid()) {
      throw new Error("Invalid date: " + origin);
    }

    let dates = this.getAllDatesForDeliverDayInMonth(origin);

    let firstThisMonth = dates[0];
    let thirdThisMonth = dates[2];

    if (
      origin.date() >= firstThisMonth.date() &&
      origin.date() < thirdThisMonth.date()
    ) {
      // If origin date is between 1st and 3rd
      return thirdThisMonth;
    } else if (origin.date() >= thirdThisMonth.date()) {
      // If origin date has passed 3rd, next delivery will be set to 1st in next month
      dates = this.getAllDatesForDeliverDayInMonth(moment(origin).add(1, "M"));
      return dates[0];
    } else {
      // If origin date is before 1st
      return firstThisMonth;
    }
  }

  private static getAllDatesForDeliverDayInMonth(date): Array<any> {
    if (!Constants.deliveryDay) {
      throw new Error(
        "Error when calculating dates for delivery days in month. Delivery day not defined."
      );
    }

    let deliveryDay = moment(date)
      .startOf("month")
      .day(Constants.deliveryDay);
    if (deliveryDay.date() > 7) {
      deliveryDay.add(7, "d");
    }

    let month = deliveryDay.month();
    let dates = [];
    while (month === deliveryDay.month()) {
      dates.push(deliveryDay.clone());
      deliveryDay.add(7, "d");
    }

    if (dates.length < 4) {
      throw new Error(
        "Error when calculating dates for delivery days in month."
      );
    }

    return dates;
  }
}
