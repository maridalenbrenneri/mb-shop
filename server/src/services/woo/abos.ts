import axios from "axios";

import { WOO_SUBSCRIPTION_API_BASE_URL } from "./settings";

interface Counter {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  six: number;
  seven: number;
  eight: number;
}

interface BagCounter {
  fortnightly: Counter;
  monthly: Counter;
}

export async function fetchAbos() {
  let abos = [];
  let page = 1;
  do {
    const result = await _fetchAbos(page);
    page = result.nextPage;
    abos = abos.concat(result.abos);
  } while (page);

  return abos;
}

export function resolveAboData(wooAbos: any) {
  const activeAbos = wooAbos.filter((s) => s.status === "active");

  const activeCount = activeAbos.length;
  const onHoldCount = wooAbos.filter((s) => s.status === "on-hold").length;

  let fortnightlyCount = 0;
  let bagsFortnightlyCount = 0;
  let monthlyCount = 0;
  let bagsMonthlyCount = 0;

  const bagCounter = initBagCounter();

  for (const abo of activeAbos) {
    if (!abo.line_items || abo.line_items.length === 0) {
      continue;
    }
    const item = abo.line_items[0];

    if (item.name.includes("Annenhver uke")) {
      fortnightlyCount++;
      bagsFortnightlyCount += resolveNumberOfBags(bagCounter, item.name, true);
    } else {
      monthlyCount++;
      bagsMonthlyCount += resolveNumberOfBags(bagCounter, item.name, false);
    }
  }

  return {
    activeCount,
    onHoldCount,
    fortnightlyCount,
    bagsFortnightlyCount,
    monthlyCount,
    bagsMonthlyCount,
    bagCounter,
  };
}

async function _fetchAbos(page: number = 1) {
  const url = `${WOO_SUBSCRIPTION_API_BASE_URL}subscriptions?page=${page}&per_page=30&${process.env.WOO_SECRET_PARAM}`;

  const response = await axios.get(url);
  const nextPage =
    response.headers["x-wp-totalpages"] === `${page}` ? null : page + 1;
  return {
    nextPage,
    abos: response.data,
  };
}

function resolveNumberOfBags(
  bagCounter: BagCounter,
  name: string,
  isFortnigthly: boolean
) {
  for (let i = 1; i <= 8; i++) {
    if (name.includes(`- ${i}`)) {
      return updateBagCounter(bagCounter, i, isFortnigthly);
    }
  }

  console.warn(`Number of bags not supported, name: ${name}`);
  return 0;
}

function updateBagCounter(
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

  if (bagsToAdd === 3) {
    if (isFortnigthly) {
      bagCounter.fortnightly.three += 1;
    } else {
      bagCounter.monthly.three += 1;
    }
    return 3;
  }

  if (bagsToAdd === 4) {
    if (isFortnigthly) {
      bagCounter.fortnightly.four += 1;
    } else {
      bagCounter.monthly.four += 1;
    }
    return 4;
  }

  if (bagsToAdd === 5) {
    if (isFortnigthly) {
      bagCounter.fortnightly.five += 1;
    } else {
      bagCounter.monthly.five += 1;
    }
    return 5;
  }

  if (bagsToAdd === 6) {
    if (isFortnigthly) {
      bagCounter.fortnightly.six += 1;
    } else {
      bagCounter.monthly.six += 1;
    }
    return 6;
  }

  if (bagsToAdd === 7) {
    if (isFortnigthly) {
      bagCounter.fortnightly.seven += 1;
    } else {
      bagCounter.monthly.seven += 1;
    }
    return 7;
  }

  if (bagsToAdd === 8) {
    if (isFortnigthly) {
      bagCounter.fortnightly.eight += 1;
    } else {
      bagCounter.monthly.eight += 1;
    }
    return 8;
  }

  throw new Error("Not supported bag count");
}

function initBagCounter(): BagCounter {
  return {
    fortnightly: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      six: 0,
      seven: 0,
      eight: 0,
    },
    monthly: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      six: 0,
      seven: 0,
      eight: 0,
    },
  };
}
