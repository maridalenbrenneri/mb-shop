import { Response, Request } from "express";
import subscriptionService from "../services/business-subscription-service";
import orderService from "../services/order-service";

class SubscriptionController {
  /**
   * GET /subscriptions
   */
  getSubscriptions = async function(req: Request, res: Response) {
    const subscriptions = await subscriptionService.getSubscriptions();

    return res.send(subscriptions);
  };

  updateSubscription = function(req: Request, res: Response) {};

  createOrderFromSubscription = function(req: Request, res: Response) {};
}

export default new SubscriptionController();
