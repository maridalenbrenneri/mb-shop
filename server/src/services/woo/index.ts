import WooModel from "../../database/models/woo-model";
import {
  fetchActiveOrders,
  resolveAndUpdateActiveCoffeesInOrders,
} from "./orders";

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

function mapToClientModel(dbModel) {
  return {
    coffeesInActiveOrders: dbModel.coffeesInActiveOrders,
    importedAt: dbModel.importedAt,
  };
}
