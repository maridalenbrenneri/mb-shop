import DeliveryDayModel from "../../database/models/delivery-day-model";

export const getDeliveryDay = async (deliveryDayId: number) => {
  const deliveryDay = await DeliveryDayModel.getDeliveryDay(deliveryDayId);
  return mapToClientModel(deliveryDay);
};

export const getDeliveryDays = async () => {
  const deliveryDays = await DeliveryDayModel.getDeliveryDays();
  return deliveryDays.map((day) => mapToClientModel(day));
};

export const getNextDeliveryDay = async () => {
  const deliveryDay = await DeliveryDayModel.getNextDeliveryDay();
  return mapToClientModel(deliveryDay);
};

export const updateDeliveryDay = async (deliveryDay: any) => {
  const dbDeliveryDay = mapToDbModel(deliveryDay);
  const updated = await DeliveryDayModel.updateDeliveryDay(
    dbDeliveryDay.id,
    dbDeliveryDay
  );
  return mapToClientModel(updated);
};

const mapToDbModel = (deliveryDay) => {
  return {
    id: deliveryDay.id,
    date: deliveryDay.date,
    type: deliveryDay.type,
    coffee1: deliveryDay.coffee1,
    coffee2: deliveryDay.coffee2,
    coffee3: deliveryDay.coffee3,
    coffee4: deliveryDay.coffee4,
  };
};

const mapToClientModel = (deliveryDay) => {
  return {
    id: deliveryDay.id,
    date: deliveryDay.date,
    type: deliveryDay.type,
    coffee1: deliveryDay.coffee1,
    coffee2: deliveryDay.coffee2,
    coffee3: deliveryDay.coffee3,
    coffee4: deliveryDay.coffee4,
  };
};
