import { Response, Request } from "express";
import orderService from "../services/mb-order-service";
import logger from "../utils/logger";
import fikenService from "../services/fiken-service";

class OrderController {
  /**
   * GET /orders/:id
   */
  getOrder = function(req: Request, res: Response, next: any) {
    orderService.getOrder(req.params.id, res).then(order => {
      return res.send(order);
    });
  };

  /**
   * GET /orders
   */
  async getOrders(_req: Request, res: Response) {
    const orders = await orderService.getOrders();
    return res.send(orders);
  }

  /**
   * POST /orders
   */
  createOrder(req: Request, res: Response) {
    return orderService.createOrder(req.body, res);
  }

  /**
   * PUT /orders/:id
   */
  updateOrder(req: Request, res: Response) {
    return orderService.updateOrder(req.body, res);
  }

  /**
   * POST /orders/:id/complete
   */
  completeOrder(req: Request, res: Response, next: any) {
    return orderService.updateOrderStatus(req.params.id, "completed", res);
  }

  /**
   * POST /orders/:id/cancel
   */
  cancelOrder(req: Request, res: Response, next: any) {
    return orderService.updateOrderStatus(req.params.id, "canceled", res);
  }

  /**
   * POST /orders/:id/process
   */
  processOrder(req: Request, res: Response, next: any) {
    return orderService.updateOrderStatus(req.params.id, "processing", res);
  }

  /**
   * POST /orders/:id/invoice
   */
  createInvoice = function(req: Request, res: Response) {
    fikenService
      .createInvoice(req.body)
      .then(() => {
        res.send("Invoice created");
      })
      .catch(function(err) {
        logger.error(err);
        res.status(500).send({
          error: "An error occured when creating the invoice: " + err
        });
      });
  };
}

export default new OrderController();
