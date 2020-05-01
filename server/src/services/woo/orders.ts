import axios from "axios";

import { getSubstringInsideParentheses } from "../../utils/utils";
import {
  WOO_API_BASE_URL,
  WOO_GABO_PRODUCT_ID,
  WOO_ABO_PRODUCT_ID,
} from "./settings";

interface WooCoffee {
  wooProductId: number;
  code: string;
  quantity: number;
}

export function resolveCoffeesInOrders(orders: any[]) {
  let lineItems = [];

  orders.map((order) => {
    const items = excludeNonCoffeeProducts(order.line_items);
    lineItems = lineItems.concat(items);
  });

  const coffees: Array<WooCoffee> = [];

  lineItems.map((item) => {
    coffees.push({
      wooProductId: item.product_id,
      quantity: item.quantity,
      code: getSubstringInsideParentheses(item.name),
    });
  });

  const dic = {};
  coffees.map((c) => {
    if (!dic[c.code]) dic[c.code] = c.quantity;
    else dic[c.code] += c.quantity;
  });

  return dic;
}

export async function fetchActiveOrders() {
  let ordersInProcess = [];
  let page = 1;
  do {
    const result = await fetchOrdersInProcess(page);
    page = result.nextPage;
    ordersInProcess = ordersInProcess.concat(result.orders);
  } while (page);

  const ordersOnHold = await fetchOrdersOnHold();

  return ordersInProcess.concat(ordersOnHold);
}

function excludeNonCoffeeProducts(lineItems) {
  return lineItems.filter((item) => {
    return (
      item.product_id !== WOO_GABO_PRODUCT_ID &&
      item.product_id !== WOO_ABO_PRODUCT_ID
    );
  });
}

// TODO: Handling paging (max 100 returned)
async function fetchOrdersOnHold() {
  const page = 1;
  const url = `${WOO_API_BASE_URL}orders?page=${page}&per_page=100&status=on-hold&${process.env.WOO_SECRET_PARAM}`;

  const response = await axios.get(url);
  return response.data;
}

// TODO: Use axios instead of Request
function fetchOrdersInProcess(page: number = 1) {
  const url = `${WOO_API_BASE_URL}orders?page=${page}&per_page=30&status=processing&${process.env.WOO_SECRET_PARAM}`;

  return new Promise<any>(function (resolve, reject) {
    const request = require("request");
    request(url, function (error: any, response: any) {
      if (error) {
        return reject(error);
      }

      if (response.statusCode !== 200) return reject(response.body);

      const orders = JSON.parse(response.body);

      const nonSubscriptionOrders = orders.filter(
        (o: { created_via: string }) => o.created_via !== "subscription"
      );

      if (response.headers["x-wp-totalpages"] === `${page}`) {
        return resolve({
          nextPage: null,
          orders: nonSubscriptionOrders,
        });
      }

      return resolve({
        nextPage: page + 1,
        orders: nonSubscriptionOrders,
      });
    });
  });
}