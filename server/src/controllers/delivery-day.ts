import { Response, Request } from "express";
import deliveryDayService from "../services/delivery-day-service";

class DeliveryDayController {
  /**
   * GET /DeliveryDays/:id
   */
  // getDeliveryDay = async function(req: Request, res: Response) {
  //   const day = await deliveryDayService.getDeliveryDay(req.body.id);
  //   return res.send(day);
  // };

  /**
   * GET /DeliveryDays
   */
  getDeliveryDays = async function(_req: Request, res: Response) {
    const days = await deliveryDayService.getDeliveryDays();
    res.send(days);
  };

  /**
   * POST /DeliveryDays
   */
  createDeliveryDay = async function(req: Request, res: Response) {
    throw new Error("Not implemented");
  };

  /**
   * PUT /DeliveryDays/:id
   */
  updateDeliveryDay = async function(req: Request, res: Response) {
    const updated = deliveryDayService.updateDeliveryDay(req.body);
    return res.send(updated);
  };
}

export default new DeliveryDayController();
