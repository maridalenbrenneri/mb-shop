import { Response } from "express";
import GiftSubscriptionModel from "../database/models/gift-subscription-model";
import logger from "../utils/logger";
import wooService from "./woo-service";
import { GiftSubscriptionValidator } from "../validators/gift-subscription-validator";
import moment = require("moment");
import { Op } from "sequelize";

class GiftSubscriptionService {
  getGiftSubscription(giftSubscriptionId: number, res: Response) {
    let self = this;

    return GiftSubscriptionModel.getGiftSubscription(giftSubscriptionId)
      .then(giftSubscription => {
        if (!giftSubscription) {
          return res.status(404).send();
        }

        return res.send(self.mapToClientModel(giftSubscription));
      })
      .catch(function(err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when getting the gift subscription"
        });
      });
  }

  async getGiftSubscriptions() {
    let self = this;

    let filter = {
      [Op.not]: [{ status: "cancelled" }]
    };

    return await GiftSubscriptionModel.getGiftSubscriptions(filter).then(
      giftSubscriptions => {
        const active = [];
        const today = moment().startOf("day");

        giftSubscriptions.forEach(item => {
          if (today <= moment(item.lastDeliveryDate)) {
            active.push(self.mapToClientModel(item));
          }
        });

        return active;
      }
    );
  }

  async createGiftSubscription(giftSubscription: any) {
    GiftSubscriptionValidator.validate(giftSubscription);

    const dbGiftSubscription = this.mapToDbModel(giftSubscription);

    const subscription = await GiftSubscriptionModel.createGiftSubscription(
      dbGiftSubscription
    );

    return this.mapToClientModel(subscription);
  }

  updateGiftSubscription(giftSubscription: any, res: Response) {
    let self = this;

    GiftSubscriptionValidator.validate(giftSubscription);

    let dbGiftSubscription = self.mapToDbModel(giftSubscription);

    return GiftSubscriptionModel.updateGiftSubscription(
      dbGiftSubscription.id,
      dbGiftSubscription
    )
      .then(updatedGiftSubscription => {
        return res.send(self.mapToClientModel(updatedGiftSubscription));
      })
      .catch(function(err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when updating the gift subscription: " + err
        });
      });
  }

  setLastOrderCreated(giftSubscriptionId: number): any {
    return GiftSubscriptionModel.updateGiftSubscription(giftSubscriptionId, {
      lastOrderCreated: moment().toDate()
    });
  }

  setFirstDeliveryDate(giftSubscriptionId: number, date: Date): any {
    GiftSubscriptionValidator.validateFirstDeliveryDate(date);

    return GiftSubscriptionModel.updateGiftSubscription(giftSubscriptionId, {
      firstDeliveryDate: date
    });
  }

  async import() {
    let importedCount = 0;

    const wooSubscriptions = await wooService.getActiveGiftSubscriptions();

    for (let i = 0; i < wooSubscriptions.length; i++) {
      const wooSubscription = wooSubscriptions[i];

      const mbSubscription = await GiftSubscriptionModel.getGiftSubscriptionByWoo(
        wooSubscription.wooOrderNumber,
        wooSubscription.recipient_name
      );

      if (!mbSubscription) {
        await GiftSubscriptionModel.createGiftSubscription(wooSubscriptions[i]);
        importedCount++;
      }
    }

    return { count: importedCount };
  }

  mapToDbModel = function(giftSubscription) {
    return {
      id: giftSubscription.id,
      wooOrderId: giftSubscription.wooOrderId,
      wooOrderNumber: giftSubscription.wooOrderNumber,
      status: giftSubscription.status,
      orderDate: giftSubscription.orderDate,
      originalFirstDeliveryDate: giftSubscription.originalFirstDeliveryDate,
      firstDeliveryDate: giftSubscription.firstDeliveryDate,
      lastDeliveryDate: giftSubscription.lastDeliveryDate,
      numberOfMonths: giftSubscription.numberOfMonths,
      frequence: giftSubscription.frequence,
      quantity: giftSubscription.quantity,
      customerName: giftSubscription.customerName,
      recipient_name: giftSubscription.recipient_name,
      recipient_email: giftSubscription.recipient_email,
      recipient_address: JSON.stringify(giftSubscription.recipient_address),
      message_to_recipient: giftSubscription.message_to_recipient,
      note: giftSubscription.note,
      lastOrderCreated: giftSubscription.lastOrderCreated
    };
  };

  mapToClientModel = function(giftSubscription) {
    return {
      id: giftSubscription.id,
      wooOrderId: giftSubscription.wooOrderId,
      wooOrderNumber: giftSubscription.wooOrderNumber,
      status: giftSubscription.status,
      orderDate: giftSubscription.orderDate,
      originalFirstDeliveryDate: giftSubscription.originalFirstDeliveryDate,
      firstDeliveryDate: giftSubscription.firstDeliveryDate,
      lastDeliveryDate: giftSubscription.lastDeliveryDate,
      numberOfMonths: giftSubscription.numberOfMonths,
      frequence: giftSubscription.frequence,
      quantity: giftSubscription.quantity,
      customerName: giftSubscription.customerName,
      recipient_name: giftSubscription.recipient_name,
      recipient_email: giftSubscription.recipient_email,
      recipient_address: JSON.parse(giftSubscription.recipient_address),
      message_to_recipient: giftSubscription.message_to_recipient,
      note: giftSubscription.note,
      lastOrderCreated: giftSubscription.lastOrderCreated
    };
  };
}

export default new GiftSubscriptionService();
