import { Response, Request } from "express";
import giftSubscriptionService from "../services/gift-subscription-service";
import { ControllerHelper } from "./controller-base";

class GiftSubscriptionController {
  /**
   * GET /giftsubscriptions/:id
   */
  getGiftSubscription = function (req: Request, res: Response) {
    return giftSubscriptionService.getGiftSubscription(req.body.id, res);
  };

  /**
   * GET /giftsubscriptions
   */
  async getGiftSubscriptions(req: Request, res: Response) {
    try {
      return res.send(await giftSubscriptionService.getGiftSubscriptions());
    } catch (e) {
      return ControllerHelper.handleError(
        res,
        e,
        "An error occured when getting gift subscriptions"
      );
    }
  }

  /**
   * POST /giftsubscriptions
   */
  async createGiftSubscription(req: Request, res: Response) {
    const subscription = await giftSubscriptionService.createGiftSubscription(
      req.body
    );
    return res.send(subscription);
  }

  /**
   * PUT /giftsubscriptions/:id/first-delivery-date
   */
  async setFirstDeliveryDate(req: Request, res: Response) {
    try {
      return res.send(
        await giftSubscriptionService.setFirstDeliveryDate(
          req.params.id,
          req.body.firstDeliveryDate
        )
      );
    } catch (e) {
      return ControllerHelper.handleError(
        res,
        e,
        "An error occured when updating the gift subscription"
      );
    }
  }
}

export default new GiftSubscriptionController();
