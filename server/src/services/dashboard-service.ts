// import giftSubscriptionService from "./gift-subscription-service";
import StatsModel from "../database/models/stats-model";
// import from "./order-service";
import mbOrderService from "./mb-order-service";
import subscriptionDateHelper from "./subscription-date-helper";
import MbOrderModel from "../database/models/mb-order-model";
import coffeeService from "./coffee-service";
import moment = require("moment");

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
    const _1000s = [];
    let totalWeight = 0;

    orders.map((o: { coffeeItems: any[] }) => {
      o.coffeeItems.map(item => {
        if (item.variationId === 1) {
          _250s.push({ id: item.coffee.id, quantity: item.quantity });
          totalWeight += 250 * item.quantity;
        } else if (item.variationId === 2) {
          _500s.push({ id: item.coffee.id, quantity: item.quantity });
          totalWeight += 500 * item.quantity;
        } else if (item.variationId === 3) {
          _1000s.push({ id: item.coffee.id, quantity: item.quantity });
          totalWeight += 1000 * item.quantity;
        }
      });
    });

    return {
      activeOrderCount: orders.length,
      quantities: {
        _250s,
        _500s,
        _1000s,
        totalWeight: totalWeight
      }
    };
  };

  async getDeliveryDays(limit: number = 3) {
    const today = moment();
    const daysAfterToday = DELIVERY_DAYS.filter(d =>
      moment(d.date).isSameOrAfter(today)
    );

    if (daysAfterToday.length < 3) throw new Error("OUT OF DELIVERY DAYS");

    const days = daysAfterToday.slice(0, limit);

    const aboStats = await StatsModel.getStats();

    for (let i = 0; i < days.length; i++) {
      days[i].quantities = await this.calculateDeliveryQuantities(
        aboStats,
        days[i].type
      );
    }

    return days;
  }

  sumArrayProp = (array: any[], key: string) => {
    if (!array || !key) return 0;

    return array.reduce((a, b) => a + (b[key] || 0), 0);
  };

  private calculateDeliveryQuantities = async (aboStats: any, type: string) => {
    // Woo subscriptions + gabos (only 250g bags)
    const data = JSON.parse(aboStats.data);
    let aboBagCount = 0;
    if (type === "monthly")
      aboBagCount =
        data.subsciptionsBagsPerMonthlyCount +
        data.subsciptionsBagsPerFortnightlyCount;
    else if (type === "fortnightly")
      aboBagCount = data.subsciptionsBagsPerFortnightlyCount;

    // TODO: get active non subscriptional orders from Woo

    // MB Backoffice orders
    const orderStats = await this.getOrderStats();

    const _250bagCount = this.sumArrayProp(
      orderStats.quantities._250s,
      "quantity"
    );

    const _500bagCount = this.sumArrayProp(
      orderStats.quantities._500s,
      "quantity"
    );

    const _1000bagCount = this.sumArrayProp(
      orderStats.quantities._1000s,
      "quantity"
    );

    const aboBagWeight = aboBagCount > 0 ? aboBagCount * 250 : 0;

    const quantities = {
      _250s: {
        totalCount: _250bagCount + aboBagCount
      },
      _500s: {
        totalCount: _500bagCount
      },
      _1000s: {
        totalCount: _1000bagCount
      },
      totalWeight: (orderStats.quantities.totalWeight + aboBagWeight) / 1000
    };

    return quantities;
  };
}

export default new DashboardService();
