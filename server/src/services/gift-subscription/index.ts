import moment = require('moment');
import { Op } from 'sequelize';

import GiftSubscriptionModel from '../../database/models/gift-subscription-model';
import { GiftSubscriptionValidator } from '../../validators/gift-subscription-validator';

export async function getGiftSubscriptions() {
  let filter = {
    [Op.not]: [{ status: 'cancelled' }],
  };

  const subscriptions = await GiftSubscriptionModel.getGiftSubscriptions(
    filter
  );

  if (!subscriptions) return null;

  const active = [];
  const today = moment().startOf('day');

  subscriptions.forEach((item: any) => {
    if (today <= moment(item.lastDeliveryDate)) {
      active.push(mapToClientModel(item));
    }
  });

  return active;
}

export async function updateGiftSubscription(giftSubscription: any) {
  GiftSubscriptionValidator.validate(giftSubscription);

  let dbGiftSubscription = mapToDbModel(giftSubscription);

  const updated = await GiftSubscriptionModel.updateGiftSubscription(
    dbGiftSubscription.id,
    dbGiftSubscription
  );

  return mapToClientModel(updated);
}

export async function setLastOrderCreated(giftSubscriptionId: number) {
  return await GiftSubscriptionModel.updateGiftSubscription(
    giftSubscriptionId,
    {
      lastOrderCreated: moment().toDate(),
    }
  );
}

const mapToDbModel = (giftSubscription: any) => {
  if (!giftSubscription) return null;
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
    recipient_mobile: giftSubscription.recipient_mobile,
    recipient_address: JSON.stringify(giftSubscription.recipient_address),
    message_to_recipient: giftSubscription.message_to_recipient,
    note: giftSubscription.note,
    lastOrderCreated: giftSubscription.lastOrderCreated,
  };
};

const mapToClientModel = (giftSubscription: any) => {
  if (!giftSubscription) return null;
  let address = null;

  try {
    address = JSON.parse(giftSubscription.recipient_address);
  } catch (err) {
    console.warn(
      'ADDRESS PARSE FAILED FOR GABO',
      giftSubscription.id,
      giftSubscription.recipient_address
    );
    throw err;
  }

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
    recipient_mobile: giftSubscription.recipient_mobile,
    recipient_address: address,
    message_to_recipient: giftSubscription.message_to_recipient,
    note: giftSubscription.note,
    lastOrderCreated: giftSubscription.lastOrderCreated,
  };
};
