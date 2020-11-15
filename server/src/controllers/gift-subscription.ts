import { Response, Request } from 'express';
import * as giftSubscriptionService from '../services/gift-subscription';
import { ControllerHelper } from './controller-base';

class GiftSubscriptionController {
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
        'An error occured when getting gift subscriptions'
      );
    }
  }

  /**
   * PUT /giftsubscriptions/:id
   */
  async updateGiftSubscription(req: Request, res: Response) {
    const subscription = await giftSubscriptionService.updateGiftSubscription(
      req.body
    );
    return res.send(subscription);
  }
}

export default new GiftSubscriptionController();
