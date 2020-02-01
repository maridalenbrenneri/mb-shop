import giftSubscriptionService from "./gift-subscription-service";
import StatsModel from "../database/models/stats-model";
import orderService from "./order-service";
import OrderModel from "../database/models/order-model";

class DashboardService {
  private wooApiBaseUrl = "https://maridalenbrenneri.no/wp-json/wc/v2/";
  private wooSubscriptionApiBaseUrl =
    "https://maridalenbrenneri.no/wp-json/wc/v1/";
}

export default new DashboardService();
