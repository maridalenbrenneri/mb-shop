import * as moment from "moment";
import axios from "axios";

import { WOO_API_BASE_URL, WOO_GABO_PRODUCT_ID } from "./settings";
import { SubscriptionFrequence } from "../../constants";
import SubscriptionDateHelper from "../subscription-date-helper";

export async function fetchActiveGabos() {
  let gabos = [];
  let page = 1;
  do {
    const result = await _fetchGabos(page);
    page = result.nextPage;
    gabos = gabos.concat(result.gabos);
  } while (page);

  const filtered = resolveActiveGabos(gabos);
  return filtered;
}

export async function importGabos(wooGaboOrders: any) {
  // TODO: not implemented - move functionality to here from gift-subscription-service

  return 0;
}

async function _fetchGabos(page: number = 1) {
  const fromCreatedDate = moment().subtract(14, "months");
  const url =
    WOO_API_BASE_URL +
    "orders?" +
    process.env.WOO_SECRET_PARAM +
    "&per_page=30" +
    "&product=" +
    WOO_GABO_PRODUCT_ID +
    "&after=" +
    fromCreatedDate.toISOString();
  const response = await axios.get(url);
  const nextPage =
    response.headers["x-wp-totalpages"] === `${page}` ? null : page + 1;
  return {
    nextPage,
    gabos: response.data,
  };
}

function resolveActiveGabos(wooGaboOrders: any): Array<any> {
  const today = moment().startOf("day");

  const activeGiftSubscriptions = new Array<any>();

  for (const order of wooGaboOrders) {
    if (
      order.status !== "processing" &&
      order.status !== "on-hold" &&
      order.status !== "completed"
    ) {
      continue;
    }

    const orderId = order.id;
    const orderNumber = +order.meta_data.find(
      (data) => data.key == "_order_number"
    ).value;
    const orderNote = order.customer_note;
    const orderDate = order.date_created;
    const orderCustomerName =
      order.billing.first_name + " " + order.billing.last_name;

    for (const item of order.line_items) {
      if (item.product_id === WOO_GABO_PRODUCT_ID) {
        item.orderId = orderId;
        item.orderNumber = orderNumber;
        item.orderDate = orderDate;
        item.orderNote = orderNote;
        item.orderCustomerName = orderCustomerName;

        let dbItem = mapFromWooToDbModel(item);

        if (today <= moment(dbItem.lastDeliveryDate)) {
          activeGiftSubscriptions.push(dbItem);
        }
      }
    }
  }

  return activeGiftSubscriptions;
}

function resolveMetadataValue(meta_data: Array<any>, key: string) {
  const res = meta_data.find((data) => data.key === key);
  return !res ? null : res.value;
}

function resolveLastDeliveryDate(
  firstDeliveryDate: Date,
  numberOfMonths: number,
  frequence: number
) {
  const date = moment(firstDeliveryDate).add(numberOfMonths - 1, "M");
  return SubscriptionDateHelper.resolveNextDeliveryDate(
    date.toDate(),
    frequence
  );
}

function mapFromWooToDbModel(orderItem: any) {
  const df = resolveMetadataValue(orderItem.meta_data, "levering");
  const frequence =
    df && df.includes("Annenhver uke")
      ? SubscriptionFrequence.fortnightly
      : SubscriptionFrequence.monthly;

  const nrOfMonths = resolveMetadataValue(
    orderItem.meta_data,
    "antall-maneder"
  );

  let startDate = null;
  let startDateString = resolveMetadataValue(orderItem.meta_data, "abo_start");

  if (!startDateString) {
    startDate = moment(orderItem.orderDate);
  } else {
    const regexp = new RegExp("..........");
    startDate = regexp.test(startDateString)
      ? moment(startDateString, "DD.MM.YYYY")
      : moment(startDateString);
  }

  // TODO: Read deliver date from DeliveryDays in db instead of on the fly calculation

  // Check from two days before in case the date is an actual delivery date (then next would have been selected).
  let firstDeliveryDate = SubscriptionDateHelper.resolveNextDeliveryDate(
    startDate.add(-2, "d").toDate(),
    frequence
  );

  if (orderItem.orderId == 3214 || orderItem.orderId == 3398) {
    // Special special... Orders has incorrect date
    firstDeliveryDate = moment("2019-01-01", "YYYY-MM-DD").toDate();
  }

  const model = {
    wooOrderId: orderItem.orderId,
    wooOrderNumber: orderItem.orderNumber,
    status: "n/a",
    orderDate: orderItem.orderDate,
    originalFirstDeliveryDate: startDate.toDate(),
    firstDeliveryDate: firstDeliveryDate,
    lastDeliveryDate: resolveLastDeliveryDate(
      firstDeliveryDate,
      nrOfMonths,
      frequence
    ),
    frequence: frequence,
    numberOfMonths: nrOfMonths,
    quantity: +resolveMetadataValue(orderItem.meta_data, "poser"),
    customerName: orderItem.orderCustomerName,
    recipient_name: resolveMetadataValue(orderItem.meta_data, "abo_name"),
    recipient_email: resolveMetadataValue(orderItem.meta_data, "abo_email"),
    recipient_address: JSON.stringify({
      street1: resolveMetadataValue(orderItem.meta_data, "abo_address1"),
      street2: resolveMetadataValue(orderItem.meta_data, "abo_address2"),
      zipCode: resolveMetadataValue(orderItem.meta_data, "abo_zip"),
      place: resolveMetadataValue(orderItem.meta_data, "city"),
    }),
    message_to_recipient: resolveMetadataValue(
      orderItem.meta_data,
      "abo_msg_retriever"
    ),
    note: orderItem.orderNote,
  };

  return model;
}
