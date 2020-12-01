import axios from 'axios';

import { getSubstringInsideParentheses } from '../../utils/utils';
import {
  WOO_API_BASE_URL,
  WOO_GABO_PRODUCT_ID,
  WOO_ABO_PRODUCT_ID,
} from './settings';

interface WooCoffee {
  wooProductId: number;
  code: string;
  quantity: number;
}

export function resolveCoffeesInOrders(orders: any[]) {
  let lineItems = [];

  orders.map((order) => {
    const items = excludeNonCoffeeAndAboProducts(order.line_items);
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
  let ordersOnHold = [];
  let page = 1;
  do {
    const result = await _fetchOrders(page, 'processing');
    page = result.nextPage;
    ordersInProcess = ordersInProcess.concat(result.orders);
  } while (page);

  console.debug('FETCH ORDERS PROCESSING DONE');

  page = 1;
  do {
    const result = await _fetchOrders(page, 'on-hold');
    page = result.nextPage;
    ordersOnHold = ordersOnHold.concat(result.orders);
  } while (page);

  console.debug('FETCH ORDERS ON-HOLD DONE');

  return ordersInProcess.concat(ordersOnHold);
}

export async function fetchPendingOrders() {
  let ordersPendingPayment = [];
  let page = 1;
  do {
    const result = await _fetchOrders(page, 'pending');
    page = result.nextPage;
    ordersPendingPayment = ordersPendingPayment.concat(result.orders);
  } while (page);

  console.debug('FETCH ORDERS PENDING PAYMENT DONE');

  return ordersPendingPayment;
}

export function resolveOrderData(
  activeOrders: any[] = [],
  pendingOrders: any[] = []
) {
  return {
    activeOrderCount: activeOrders.length,
    pendingOrderCount: pendingOrders.length,
  };
}

// TODO: Only exclude monthly subscription
function excludeNonCoffeeAndAboProducts(lineItems) {
  // Exclude gabo and all subscriptions items

  const nonAboItems = lineItems.filter(
    (o: { created_via: string }) => o.created_via !== 'subscription'
  );

  return nonAboItems.filter((item) => {
    return (
      item.product_id !== WOO_GABO_PRODUCT_ID &&
      item.product_id !== WOO_ABO_PRODUCT_ID
    );
  });
}

async function _fetchOrders(page: number = 1, status: string) {
  const url = `${WOO_API_BASE_URL}orders?page=${page}&per_page=30&status=${status}&${process.env.WOO_SECRET_PARAM}`;

  const response = await axios.get(url);

  if (!response.data || response.data.length === 0) {
    return {
      nextPage: null,
      orders: [],
    };
  }

  const nextPage =
    response.headers['x-wp-totalpages'] === `${page}` ? null : page + 1;

  return {
    nextPage,
    orders: response.data,
  };
}
