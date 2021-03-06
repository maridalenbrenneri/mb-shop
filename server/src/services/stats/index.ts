import { getWooData } from '../woo';
import { getGiftSubscriptions } from '../gift-subscription';
import { BagCounter } from '../woo/abos';

export async function getData() {
  const wooData = await getWooData();
  const gabos = await getGiftSubscriptions();
  const aboData = aggregateGaboData(gabos, wooData);

  return {
    aboData,
    coffeesInActiveNonAboOrders: wooData.coffeesInActiveNonAboOrders,
    dataFromWooLastUpdated: wooData.importedAt,
    wooOrderData: { ...wooData.orderData },
  };
}

function aggregateGaboData(gabos, wooData) {
  let monthlyCount = wooData.aboData.monthlyCount;
  let bagsMonthlyCount = wooData.aboData.bagsMonthlyCount;
  let fortnightlyCount = wooData.aboData.fortnightlyCount;
  let bagsFortnightlyCount = wooData.aboData.bagsFortnightlyCount;

  const bagCounter = wooData.aboData.bagCounter;

  for (const gabo of gabos) {
    const bags = gabo.quantity;
    const isFortnighlty = gabo.frequence === 2;
    updateBagCounterForGabos(bagCounter, bags, isFortnighlty);

    if (isFortnighlty) {
      bagsFortnightlyCount += bags;
      fortnightlyCount++;
    } else {
      bagsMonthlyCount += bags;
      monthlyCount++;
    }
  }

  return {
    bagCounter,
    monthlyCount,
    bagsMonthlyCount,
    fortnightlyCount,
    bagsFortnightlyCount,
    gaboCount: gabos.length,
  };
}

function updateBagCounterForGabos(
  bagCounter: BagCounter,
  bagsToAdd: number,
  isFortnigthly: boolean
) {
  if (bagsToAdd === 1) {
    if (isFortnigthly) {
      bagCounter.fortnightly.one += 1;
    } else {
      bagCounter.monthly.one += 1;
    }
    return 1;
  }

  if (bagsToAdd === 2) {
    if (isFortnigthly) {
      bagCounter.fortnightly.two += 1;
    } else {
      bagCounter.monthly.two += 1;
    }
    return 2;
  }

  // fortnightly no longer available (some old gabos with 1 or 2 bags can still have it)
  if (isFortnigthly) return 0;

  if (bagsToAdd === 3) {
    bagCounter.monthly.three += 1;
    return 3;
  }

  if (bagsToAdd === 4) {
    bagCounter.monthly.four += 1;
    return 4;
  }

  if (bagsToAdd === 5) {
    bagCounter.monthly.five += 1;
    return 5;
  }

  if (bagsToAdd === 6) {
    bagCounter.monthly.six += 1;
    return 6;
  }

  if (bagsToAdd === 7) {
    bagCounter.monthly.seven += 1;
    return 7;
  }

  throw new Error(
    `Not supported bag count (${bagsToAdd}), gabo can currently maximum have 7 bags`
  );
}
