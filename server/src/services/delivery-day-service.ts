import DeliveryDayModel from "../database/models/delivery-day-model";

class DeliveryDayService {
  getDeliveryDay = async function(deliveryDayId: number) {
    const deliveryDay = await DeliveryDayModel.getDeliveryDay(deliveryDayId);
    return this.mapToClientModel(deliveryDay);
  };

  getDeliveryDays = async function() {
    const deliveryDays = await DeliveryDayModel.getDeliveryDays();
    return deliveryDays.map(day => this.mapToClientModel(day));
  };

  getNextDeliveryDay = async function() {
    const deliveryDay = await DeliveryDayModel.getNextDeliveryDay();
    return this.mapToClientModel(deliveryDay);
  };

  updateDeliveryDay = async function(deliveryDay: any) {
    const dbDeliveryDay = this.mapToDbModel(deliveryDay);
    const updated = await DeliveryDayModel.updateDeliveryDay(
      dbDeliveryDay.id,
      dbDeliveryDay
    );
    return this.mapToClientModel(updated);
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
