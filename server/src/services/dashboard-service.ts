import moment = require("moment");

import mbOrderService from "./mb-order-service";
import MbOrderModel from "../database/models/mb-order-model";
import coffeeService from "./coffee-service";
import { getDeliveryDays } from "./delivery-day";
import { getData } from "./stats";

class IAddableCoffeeItem {
  variationId: number;
  coffee: any;
  quantity: number;
}

class DashboardService {
  getCurrentCoffees = async () => {
    return await coffeeService.getCoffees();
  };

  getQuantitiesForMbOrdersAndWooNonAbo = () => {};

  calculateQuantities = (items: IAddableCoffeeItem[]) => {
    const _250s = [];
    const _500s = [];
    const _1200s = [];
    let totalWeight = 0;

    const add = (sizeArray, id, quantity) => {
      const index = sizeArray.findIndex((i) => {
        return i.id === id;
      });

      if (index >= 0) sizeArray[index].quantity += quantity;
      else sizeArray.push({ id, quantity });
    };

    items.map((item) => {
      if (item.variationId === 1) {
        add(_250s, item.coffee.id, item.quantity);
        totalWeight += 250 * item.quantity;
      } else if (item.variationId === 2) {
        add(_500s, item.coffee.id, item.quantity);
        totalWeight += 500 * item.quantity;
      } else if (item.variationId === 3) {
        add(_1200s, item.coffee.id, item.quantity);
        totalWeight += 1200 * item.quantity;
      }
    });

    return {
      quantities: {
        _250s,
        _500s,
        _1200s,
        totalWeight: totalWeight,
      },
    };
  };

  // MB orders
  getOrderStats = async () => {
    const dbOrders = await MbOrderModel.getMbOrdersProcessing();
    const orders = dbOrders.map((order: MbOrderModel) =>
      mbOrderService.mapToClientModel(order)
    );

    let items = [];

    orders.map((o: { coffeeItems: any[] }) => {
      items = items.concat(o.coffeeItems);
    });

    const m = this.merge(items);

    return {
      activeOrderCount: orders.length,
      ...m,
    };
  };

  getDeliveryDaysForDashboard = async (limit: number = 3) => {
    const today = moment().startOf("day");

    const ddays = await getDeliveryDays();

    const daysAfterToday = ddays.filter((d: any) =>
      moment(d.date).isSameOrAfter(today)
    );

    if (daysAfterToday.length < 3) throw new Error("OUT OF DELIVERY DAYS");

    const days = daysAfterToday.slice(0, limit);

    const statsData = await getData();

    for (let i = 0; i < days.length; i++) {
      days[i].quantities = await this.calculateDeliveryQuantities(
        statsData,
        days[i].type,
        i === 0 // // Only include processing orders for first (next) delivery day
      );
    }

    return days;
  };

  getSubscriptionCoffeeTypesCount = async () => {
    const statsData = await getData();

    const monthly = this.countBags(statsData.aboData.bagCounter.monthly);
    const smallAbo = this.countBags(statsData.aboData.bagCounter.fortnightly);
    const bigAbo = this.aggregateCoffeeTypeCount(monthly, smallAbo);

    return {
      bigAbo,
      smallAbo,
    };
  };

  private aggregateCoffeeTypeCount = (count1: any, count2: any) => {
    count1.coffee1 += count2.coffee1;
    count1.coffee2 += count2.coffee2;
    count1.coffee3 += count2.coffee3;
    count1.coffee4 += count2.coffee4;
    count1.total += count2.total;

    return count1;
  };

  private countBags = (type: any) => {
    const coffee1 =
      type.one +
      type.two +
      type.three +
      type.four +
      (type.five > 0 ? type.five * 2 : 0) +
      (type.six > 0 ? type.six * 2 : 0) +
      (type.seven > 0 ? type.seven * 2 : 0);

    const coffee2 =
      type.two +
      type.three +
      type.four +
      type.five +
      (type.six > 0 ? type.six * 2 : 0) +
      (type.seven > 0 ? type.seven * 2 : 0);

    const coffee3 =
      type.three +
      type.four +
      type.five +
      (type.six > 0 ? type.six * 2 : 0) +
      (type.seven > 0 ? type.seven * 2 : 0);

    const coffee4 = type.four + type.five + type.six + type.seven;

    const total = coffee1 + coffee2 + coffee3 + coffee4;

    return { total, coffee1, coffee2, coffee3, coffee4 };
  };

  private calculateDeliveryQuantities = async (
    statsData: any,
    type: string,
    isFirst: boolean = false
  ) => {
    let aboBagCount = 0;
    if (type === "monthly")
      aboBagCount =
        statsData.aboData.bagsMonthlyCount +
        statsData.aboData.bagsFortnightlyCount;
    else if (type === "fortnightly")
      aboBagCount = statsData.aboData.bagsFortnightlyCount;

    const aboBagWeight = aboBagCount > 0 ? aboBagCount * 250 : 0;

    // Only calculate full quantity overview for the next (first) delivery day, for future
    // delivery days we can only predict abo's
    if (!isFirst) {
      return {
        _250s: { totalCount: aboBagCount },
        _500s: { totalCount: 0 },
        _1200s: { totalCount: 0 },
        totalWeight: aboBagWeight / 1000,
      };
    }

    const coffees = await coffeeService.getCoffees();
    let count = 0;
    const items: IAddableCoffeeItem[] = [];

    Object.keys(statsData.coffeesInActiveNonAboOrders).map((key) => {
      const coffee = coffees.find((c) => c.code === key);
      if (coffee) {
        items.push({
          variationId: 1,
          coffee,
          quantity: statsData.coffeesInActiveNonAboOrders[key],
        });
      }
    });
    const activeNonAboWeight = count * 250;

    console.log(
      "statsData.coffeesInActiveNonAboOrders",
      statsData.coffeesInActiveNonAboOrders,
      count
    );

    // MB Backoffice orders
    const orderStats = await this.getQuantitiesForMbOrdersAndWooNonAbo();

    // Weight of coffees in mb orders, abos/gabos and woo non-abo orders
    const totalWeight =
      (orderStats.quantities.totalWeight + aboBagWeight + activeNonAboWeight) /
      1000;

    return {
      coffeeItems: orderStats.quantities,
      totalWeight,
    };
  };
}

export default new DashboardService();
