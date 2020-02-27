import { Response, Request } from "express";
import subscriptionService from "../services/business-subscription-service";

class SubscriptionController {
  /**
   * GET /subscriptions
   */
  getSubscriptions = async function(req: Request, res: Response) {
    const subscriptions = await subscriptionService.getSubscriptions();

    return res.send(subscriptions);
  };

  createSubscription = async function(req: Request, res: Response) {
    const updated = await subscriptionService.createSubscription(req.body);
    return res.send(updated);
  };

  updateSubscription = async function(req: Request, res: Response) {
    const updated = await subscriptionService.updateSubscription(req.body);
    return res.send(updated);
  };

  createOrderFromSubscription = async function(req: Request, res: Response) {
    const created = await subscriptionService.createSubscription(req.body);
    return res.send(created);
  };
}

export default new SubscriptionController();
