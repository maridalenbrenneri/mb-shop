import { Response, Request } from "express";
import subscriptionService from "../services/subscription-service";
import subscriptionEngineService from "../services/subscription-engine-service";
import orderService from "../services/order-service";
import logger from "../utils/logger";

class SubscriptionController {
  /**
   * GET /subacriptions
   */
  getSubscriptions = function(req: Request, res: Response) {
    let filter = {};

    // get orders with SubscriptionData (isSubscriptionParent)
    orderService.getOrders({});

    // subscriptionService.getSubscriptions(filter).then(subscriptions => {
    //   res.send(subscriptions);
    // });
  };

  updateSubscription = function(req: Request, res: Response) {};

  /**
   * GET /subscription/data/delivery-dates
   */
  getNextStandardDeliveryDates = function(
    req: Request,
    res: Response,
    next: any
  ) {
    try {
      let result = subscriptionService.getNextDeliveryDates();
      res.send(result);
    } catch (err) {
      logger.error(err);
      res.status(500).send({ error: err });
    }
  };

  /********************************/
  /* Subscription Engine Functions
  /********************************/

  /*
   * POST /subscription/engine/create-renewal-orders
   */
  createRenewalOrders = function(req: Request, res: Response) {
    return subscriptionEngineService.createRenewalOrders(res);
  };
}

export default new SubscriptionController();
