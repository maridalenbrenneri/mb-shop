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
    try {
      const order = await subscriptionService.createOrderForSubscription(
        req.body.subscription,
        req.body.customer
      );
      return res.send(order);
    } catch (e) {
      return res.status(400).send(`${e.message}`);
    }
  };
}

export default new SubscriptionController();
