import axios from "axios";

import WooModel from "../database/models/woo-model";
import { getSubstringInsideParentheses } from "../utils/utils";

interface WooCoffee {
  wooProductId: number;
  code: string;
  quantity: number;
}

const WOO_API_BASE_URL = "https://maridalenbrenneri.no/wp-json/wc/v3/";

export async function getWooData() {
  const result = await WooModel.getWooData();
  return mapToClientModel(result);
}

export async function getActiveOrders() {
  return await fetchActiveOrders();
}

export async function importWooData() {
  const orders = await fetchActiveOrders();
  const result = await resolveAndUpdateActiveCoffeesInOrders(orders);

  return mapToClientModel(result);
}

async function resolveAndUpdateActiveCoffeesInOrders(orders: any[]) {
  let lineItems = [];

  orders.map((order) => {
    lineItems = lineItems.concat(order.line_items);
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

  return await WooModel.updateWooData({ coffeesInActiveOrders: dic });
}

async function fetchActiveOrders() {
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

function mapToClientModel(dbModel) {
  return {
    coffeesInActiveOrders: dbModel.coffeesInActiveOrders,
    importedAt: dbModel.importedAt,
  };
}
