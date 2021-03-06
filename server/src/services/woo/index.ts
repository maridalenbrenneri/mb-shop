import WooModel from "../../database/models/woo-model";
import {
  fetchActiveOrders,
  resolveCoffeesInOrders,
  fetchPendingOrders,
  resolveOrderData,
} from "./orders";
import { fetchActiveGabos, importGabos } from "./gabos";
import { fetchAbos, resolveAboData } from "./abos";

export async function getWooData() {
  const result = await WooModel.getWooData();
  return mapToClientModel(result);
}

export async function getActiveOrders() {
  return await fetchActiveOrders();
}

export async function importWooData() {
  // Enkeltordre
  const orders = await fetchActiveOrders();
  const coffeesInActiveOrders = resolveCoffeesInOrders(orders);
  const pendingOrders = await fetchPendingOrders();
  const orderData = resolveOrderData(orders, pendingOrders);

  console.log("Fetched coffeesInActiveOrders", coffeesInActiveOrders);

  // Gabos
  const gabos = await fetchActiveGabos();
  const lastImportedCount = await importGabos(gabos);
  const gaboData = { lastImportedCount };

  console.log("Fetched and imported gabo data", gaboData);

  // Abos
  const abos = await fetchAbos();
  const aboData = resolveAboData(abos);

  // Update database
  const updatedData = await WooModel.updateWooData({
    coffeesInActiveOrders,
    orderData,
    aboData,
    gaboData,
  });

  return mapToClientModel(updatedData);
}

function mapToClientModel(data) {
  return {
    aboData: JSON.parse(data.aboData),
    gaboData: JSON.parse(data.gaboData),
    orderData: JSON.parse(data.orderData),
    coffeesInActiveNonAboOrders: JSON.parse(data.coffeesInActiveOrders),
    importedAt: data.importedAt,
  };
}
