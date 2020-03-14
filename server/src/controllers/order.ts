import { Response, Request } from "express";
import orderService from "../services/mb-order-service";
import logger from "../utils/logger";
import fikenService from "../services/fiken-service";

class OrderController {
  /**
   * GET /orders/:id
   */
  async getOrder(req: Request, res: Response) {
    const order = await orderService.getOrder(req.params.id);
    return res.send(order);
  }

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
  async createOrder(req: Request, res: Response) {
    const order = await orderService.createOrder(req.body);
    return res.send(order);
  }

  /**
   * PUT /orders/:id
   */
  async updateOrder(req: Request, res: Response) {
    const order = await orderService.updateOrder(req.body);
    return res.send(order);
  }

  /**
   * POST /orders/:id/complete
   */
  completeOrder(req: Request, res: Response) {
    const order = orderService.updateOrderStatus(req.params.id, "completed");
    return res.send(order);
  }

  /**
   * POST /orders/:id/cancel
   */
  cancelOrder(req: Request, res: Response) {
    const order = orderService.updateOrderStatus(req.params.id, "canceled");
    return res.send(order);
  }

  /**
   * POST /orders/:id/process
   */
  processOrder(req: Request, res: Response) {
    const order = orderService.updateOrderStatus(req.params.id, "processing");
    return res.send(order);
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
