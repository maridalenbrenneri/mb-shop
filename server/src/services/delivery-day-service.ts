import { Response } from "express";
import DeliveryDayModel from "../database/models/delivery-day-model";
import logger from "../utils/logger";

class DeliveryDayService {
  getDeliveryDay = async function(deliveryDayId: number) {
    let self = this;

    return DeliveryDayModel.getDeliveryDay(deliveryDayId).then(deliveryDay => {
      return self.mapToClientModel(deliveryDay);
    });
  };

  getDeliveryDays = async function() {
    let self = this;
    let filter = {};

    const deliveryDays = await DeliveryDayModel.getDeliveryDays(filter);

    return deliveryDays.map(p => self.mapToClientModel(p));
  };

  updateDeliveryDay = async function(deliveryDay: any) {
    let self = this;

    let dbDeliveryDay = self.mapToDbModel(deliveryDay);

    return DeliveryDayModel.updateDeliveryDay(
      dbDeliveryDay.id,
      dbDeliveryDay
    ).then(updatedDeliveryDay => {
      return self.mapToClientModel(updatedDeliveryDay);
    });
  };

  mapToDbModel = function(deliveryDay) {
    return {
      id: deliveryDay.id,
      date: deliveryDay.date,
      type: deliveryDay.type,
      coffee1: deliveryDay.coffee1,
      coffee2: deliveryDay.coffee2,
      coffee3: deliveryDay.coffee3,
      coffee4: deliveryDay.coffee4
    };
  };

  mapToClientModel = function(deliveryDay) {
    return {
      id: deliveryDay.id,
      date: deliveryDay.date,
      type: deliveryDay.type,
      coffee1: deliveryDay.coffee1,
      coffee2: deliveryDay.coffee2,
      coffee3: deliveryDay.coffee3,
      coffee4: deliveryDay.coffee4
    };
  };
}

export default new DeliveryDayService();
