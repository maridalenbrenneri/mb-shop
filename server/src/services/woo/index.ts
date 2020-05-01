import WooModel from "../../database/models/woo-model";
import { fetchActiveOrders, resolveCoffeesInOrders } from "./orders";
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

  console.log("Fetched coffeesInActiveOrders", coffeesInActiveOrders);

  // Gabos
  const gabos = await fetchActiveGabos();
  const importedGaboCount = await importGabos(gabos);
  const gaboData = { lastImportedCount: importedGaboCount };

  console.log("Fetched gabo data", gaboData);

  // Abos
  const abos = await fetchAbos();
  const aboData = resolveAboData(abos);

  console.log("Fetched abo data", aboData);

  // Update database
  const updatedData = await WooModel.updateWooData({
    coffeesInActiveOrders,
    aboData,
    gaboData,
  });

  return mapToClientModel(updatedData);
}

function mapToClientModel(data) {
  return {
    coffeesInActiveOrders: JSON.parse(data.coffeesInActiveOrders),
    aboData: JSON.parse(data.aboData),
    gaboData: JSON.parse(data.gaboData),
    importedAt: data.importedAt,
  };
}
