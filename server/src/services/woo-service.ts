import * as moment from "moment";
import * as https from "https";
import { SubscriptionFrequence } from "../constants";
import { SubscriptionDateHelper } from "./subscription-date-helper";

const WOO_API_BASE_URL = "https://maridalenbrenneri.no/wp-json/wc/v2/";
const GIFT_SUBSCRIPTION_GIFT_ID = 968;

class WooService {
  getActiveGiftSubscriptions() {
    let self = this;
    const url =
      WOO_API_BASE_URL +
      "orders?" +
      process.env.WOO_SECRET_PARAM +
      "&product=" +
      GIFT_SUBSCRIPTION_GIFT_ID;

    return new Promise<Array<any>>(function(resolve, reject) {
      https
        .get(url, orderResponse => {
          if (orderResponse.statusCode == 401) {
            reject(new Error("Not authorized with Woo"));
          }

          orderResponse.setEncoding("utf8");
          let rawData = "";
          orderResponse.on("data", chunk => {
            rawData += chunk;
          });
          orderResponse.on("end", () => {
            try {
              return resolve(
                self.filterActiveGiftSubscriptions(JSON.parse(rawData))
              );
            } catch (e) {
              reject(e);
            }
          });
        })
        .on("error", e => {
          reject(e);
        });
    });
  }

  resolveLastDeliveryDate(
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

  private filterActiveGiftSubscriptions(orders: any): Array<any> {
    const self = this;
    const today = moment().startOf("day");

    const activeGiftSubscriptions = new Array<any>();

    for (const order of orders) {
      if (
        order.status !== "processing" &&
        order.status !== "on-hold" &&
        order.status !== "completed"
      ) {
        continue;
      }

      const orderId = order.id;
      const orderNumber = +order.meta_data.find(
        data => data.key == "_order_number"
      ).value;
      const orderNote = order.customer_note;
      const orderDate = order.date_created;
      const orderCustomerName =
        order.billing.first_name + " " + order.billing.last_name;

      for (const item of order.line_items) {
        if (item.product_id === GIFT_SUBSCRIPTION_GIFT_ID) {
          item.orderId = orderId;
          item.orderNumber = orderNumber;
          item.orderDate = orderDate;
          item.orderNote = orderNote;
          item.orderCustomerName = orderCustomerName;

          let dbItem = self.mapFromWooToDbModel(item);

          if (today <= moment(dbItem.lastDeliveryDate)) {
            activeGiftSubscriptions.push(dbItem);
          }
        }
      }
    }

    return activeGiftSubscriptions;
  }

  private resolveMetadataValue(meta_data: Array<any>, key: string) {
    const res = meta_data.find(data => data.key === key);
    return !res ? null : res.value;
  }

  private mapFromWooToDbModel(orderItem: any) {
    const df = this.resolveMetadataValue(orderItem.meta_data, "levering");
    const frequence =
      df && df.includes("Annenhver uke")
        ? SubscriptionFrequence.fortnightly
        : SubscriptionFrequence.monthly;

    const nrOfMonths = this.resolveMetadataValue(
      orderItem.meta_data,
      "antall-maneder"
    );

    let startDate = null;
    let startDateString = this.resolveMetadataValue(
      orderItem.meta_data,
      "abo_start"
    );

    if (!startDateString) {
      startDate = moment(orderItem.orderDate);
    } else {
      const regexp = new RegExp("..........");
      startDate = regexp.test(startDateString)
        ? moment(startDateString, "DD.MM.YYYY")
        : moment(startDateString);
    }

    // Check from day before in case the date is an actual delivery date (then next would have been selected).
    let firstDeliveryDate = SubscriptionDateHelper.resolveNextDeliveryDate(
      startDate.add(-1, "d").toDate(),
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
      lastDeliveryDate: this.resolveLastDeliveryDate(
        firstDeliveryDate,
        nrOfMonths,
        frequence
      ),
      frequence: frequence,
      numberOfMonths: nrOfMonths,
      quantity: +this.resolveMetadataValue(orderItem.meta_data, "poser"),
      customerName: orderItem.orderCustomerName,
      recipient_name: this.resolveMetadataValue(
        orderItem.meta_data,
        "abo_name"
      ),
      recipient_email: this.resolveMetadataValue(
        orderItem.meta_data,
        "abo_email"
      ),
      recipient_address: JSON.stringify({
        street1: this.resolveMetadataValue(orderItem.meta_data, "abo_address1"),
        street2: this.resolveMetadataValue(orderItem.meta_data, "abo_address2"),
        zipCode: this.resolveMetadataValue(orderItem.meta_data, "abo_zip"),
        place: this.resolveMetadataValue(orderItem.meta_data, "city")
      }),
      message_to_recipient: this.resolveMetadataValue(
        orderItem.meta_data,
        "abo_msg_retriever"
      ),
      note: orderItem.orderNote
    };

    return model;
  }
}

export default new WooService();
