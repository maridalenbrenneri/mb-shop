import StatsModel from "../database/models/stats-model";
import mbOrderService from "./mb-order-service";
import MbOrderModel from "../database/models/mb-order-model";
import coffeeService from "./coffee-service";
import moment = require("moment");
import deliveryDayService from "./delivery-day-service";

const DELIVERY_DAYS = [
  { date: new Date("2020-03-02"), type: "monthly", quantities: {} },
  { date: new Date("2020-03-09"), type: "normal", quantities: {} },
  { date: new Date("2020-03-16"), type: "fortnightly", quantities: {} },
  { date: new Date("2020-03-23"), type: "normal", quantities: {} },
  { date: new Date("2020-03-30"), type: "normal", quantities: {} }
];

class DashboardService {
  getCurrentCoffees = async () => {
    return await coffeeService.getCoffees();
  };

  getOrderStats = async () => {
    const dbOrders = await MbOrderModel.getMbOrders({ status: "processing" });
    const orders = dbOrders.map((order: MbOrderModel) =>
      mbOrderService.mapToClientModel(order)
    );

    const _250s = [];
    const _500s = [];
    const _1200s = [];
    let totalWeight = 0;

    const add = (sizeArray, id, quantity) => {
      const index = sizeArray.findIndex(i => {
        return i.id === id;
      });

      if (index >= 0) sizeArray[index].quantity += quantity;
      else sizeArray.push({ id, quantity });
    };

    orders.map((o: { coffeeItems: any[] }) => {
      o.coffeeItems.map(item => {
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
    });

    return {
      activeOrderCount: orders.length,
      quantities: {
        _250s,
        _500s,
        _1200s,
        totalWeight: totalWeight
      }
    };
  };

  getDeliveryDays = async (limit: number = 3) => {
    const today = moment();

    const ddays = await deliveryDayService.getDeliveryDays();

    const daysAfterToday = ddays.filter(d =>
      moment(d.date).isSameOrAfter(today)
    );

    if (daysAfterToday.length < 3) throw new Error("OUT OF DELIVERY DAYS");

    const days = daysAfterToday.slice(0, limit);

    const aboStats = await StatsModel.getStats();

    for (let i = 0; i < days.length; i++) {
      days[i].quantities = await this.calculateDeliveryQuantities(
        aboStats,
        days[i].type,
        i === 0
      );
    }

    // Only include processing orders for first (next) delivery day

    return days;
  };

  getSubscriptionCoffeeTypesCount = async () => {
    const aboStats = await StatsModel.getStats();
    const data = JSON.parse(aboStats.data);

    const monthly = this.countBags(data.bagCounter.monthly);
    const smallAbo = this.countBags(data.bagCounter.fortnightly);
    const bigAbo = this.aggregateCoffeeTypeCount(monthly, smallAbo);

    return {
      bigAbo,
      smallAbo
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

  private sumArrayProp = (array: any[], key: string) => {
    if (!array || !key) return 0;

    return array.reduce((a, b) => a + (b[key] || 0), 0);
  };

  private calculateDeliveryQuantities = async (
    aboStats: any,
    type: string,
    isFirst: boolean = false
  ) => {
    // Woo subscriptions + gabos (only 250g bags)
    const data = JSON.parse(aboStats.data);
    let aboBagCount = 0;
    if (type === "monthly")
      aboBagCount =
        data.subsciptionsBagsPerMonthlyCount +
        data.subsciptionsBagsPerFortnightlyCount;
    else if (type === "fortnightly")
      aboBagCount = data.subsciptionsBagsPerFortnightlyCount;

    const aboBagWeight = aboBagCount > 0 ? aboBagCount * 250 : 0;

    if (!isFirst) {
      return {
        _250s: {
          totalCount: aboBagCount
        },
        _500s: {
          totalCount: 0
        },
        _1200s: {
          totalCount: 0
        },
        totalWeight: aboBagWeight / 1000
      };
    }
    // TODO: get active non subscriptional orders from Woo

    // MB Backoffice orders
    const orderStats = await this.getOrderStats();

    const quantities = {
      coffeeItems: orderStats.quantities,
      totalWeight: (orderStats.quantities.totalWeight + aboBagWeight) / 1000 // Weight of mb orders and abos/gabos
    };
    return quantities;
  };
}

export default new DashboardService();
