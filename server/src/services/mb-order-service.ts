import { Response } from "express";
import MbOrderModel from "../database/models/mb-order-model";
// import { MbOrderValidator } from "../validators/mb-order-validator";
import { ValidationError } from "../models/validation-error";
import { OrderStatus } from "../constants";
import logger from "../utils/logger";

class MbOrderService {
  createOrder(mbOrder: any, res: Response) {
    let self = this;
    // MbOrderValidator.validate(mbOrder);

    mbOrder.status = OrderStatus.processing;

    return MbOrderModel.createMbOrder(self.mapToDbModel(mbOrder))
      .then(dbMbOrder => {
        let clientMbOrder = self.mapToClientModel(dbMbOrder);

        return res.send(clientMbOrder);
      })
      .catch(function(err) {
        self.handleError(err, res);
      });
  }

  updateOrder(mbOrder: any, res: Response) {
    let self = this;
    // MbOrderValidator.validate(mbOrder);

    const mbOrderToUpdate = self.mapToDbModel(mbOrder);
    return MbOrderModel.updateMbOrder(mbOrder.id, mbOrderToUpdate)
      .then(updatedMbOrder => {
        return res.send(self.mapToClientModel(updatedMbOrder));
      })
      .catch(function(err) {
        self.handleError(err, res);
      });
  }

  getOrder(mbOrderId: number, res: Response) {
    let self = this;
    return MbOrderModel.getMbOrder(mbOrderId).then(dbMbOrder => {
      if (!dbMbOrder) {
        return res
          .status(404)
          .send("Order was not found, order id: " + mbOrderId);
      }
      return res.send(self.mapToClientModel(dbMbOrder));
    });
  }

  async getOrders(filter = {}) {
    let self = this;
    const orders = await MbOrderModel.getMbOrders(filter);
    return orders.map(mbOrder => self.mapToClientModel(mbOrder));
  }

  updateOrderStatus(mbOrderId: number, newStatus: string, res: Response) {
    let self = this;

    return MbOrderModel.getMbOrder(mbOrderId)
      .then(function(mbOrder) {
        // MbOrderValidator.validateStatus(mbOrder.status, newStatus);

        return MbOrderModel.updateMbOrderStatus(mbOrderId, newStatus).then(
          updatedMbOrder => {
            return res.send(self.mapToClientModel(updatedMbOrder));
          }
        );
      })
      .catch(function(err) {
        self.handleError(err, res);
      });
  }

  handleError(err: any, res: Response) {
    if (err instanceof ValidationError) {
      return res.status(422).send({ validationError: err.message });
    }

    logger.error(err);
    return res
      .status(500)
      .send({ error: "An error occured when updating the mbOrder: " + err });
  }

  mapToDbModel = function(mbOrder: any) {
    return {
      orderDate: mbOrder.orderDate || Date.now(),
      deliveryDate: mbOrder.deliveryDate || Date.now(),
      status: mbOrder.status,
      externalCustomerNumber: mbOrder.customer.customerNumber,
      customer: JSON.stringify(mbOrder.customer),
      coffeeItems: JSON.stringify(mbOrder.coffeeItems),
      freight: mbOrder.freight,
      notes: mbOrder.notes
    };
  };

  mapToClientModel = function(mbOrder: any) {
    return {
      id: mbOrder.id,
      orderDate: mbOrder.orderDate,
      deliveryDate: mbOrder.deliveryDate,
      status: mbOrder.status,
      customer: JSON.parse(mbOrder.customer),
      coffeeItems: JSON.parse(mbOrder.coffeeItems),
      freight: mbOrder.freight,
      notes: mbOrder.notes
    };
  };
}

export default new MbOrderService();
