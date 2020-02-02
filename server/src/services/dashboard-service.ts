// import giftSubscriptionService from "./gift-subscription-service";
import StatsModel from "../database/models/stats-model";
import orderService from "./order-service";
import OrderModel from "../database/models/order-model";
import subscriptionDateHelper from "./subscription-date-helper";

class DashboardService {
  getNextDeliveryDays = async (dayCount: number) => {
    const days = subscriptionDateHelper.getNextDeliveryDays(dayCount);
    if (days.length > 0) {
      days[0].quantities = await this.calculateDeliveryQuantities(days[0]);
    }
    return days;
  };

  calculateDeliveryQuantities = async (deliveryDay: { type: string }) => {
    if (deliveryDay.type === "monthly") {
      const stats = await StatsModel.getStats();
      const data = JSON.parse(stats.data);

      const bagCount =
        data.subsciptionsBagsPerMonthlyCount +
        data.subsciptionsBagsPerFortnightlyCount;

      // TODO: get active non subscriptional orders from Woo

      // TODO: get active orders from backoffice

      return {
        bags250: bagCount
      };
    }

    if (deliveryDay.type === "fortnightly") {
      const stats = await StatsModel.getStats();
      const data = JSON.parse(stats.data);

      const bagCount = data.subsciptionsBagsPerFortnightlyCount;

      // TODO: get active non subscriptional orders from Woo

      // TODO: get active orders from backoffice

      return {
        bags250: bagCount
      };
    }

    return {};
  };

  getOrderStats = async () => {
    const dbOrders = await OrderModel.getOrders({ status: "processing" });
    const orders = dbOrders.map((order: OrderModel) =>
      orderService.mapToClientModel(order)
    );
    console.log("orders", JSON.stringify(orders[0].items));
    return {
      activeOrderCount: orders.length
    };
  };
}

export default new DashboardService();
