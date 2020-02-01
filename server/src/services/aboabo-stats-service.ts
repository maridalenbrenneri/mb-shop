import giftSubscriptionService from "./gift-subscription-service";
import StatsModel from "../database/models/stats-model";
import orderService from "./order-service";
import OrderModel from "../database/models/order-model";

class Counter {
  one: number = 0;
  two: number = 0;
  three: number = 0;
  four: number = 0;
  five: number = 0;
  six: number = 0;
  seven: number = 0;
  eight: number = 0;
}

class BagCounter {
  fortnightly: Counter;
  monthly: Counter;
}

class Stats {
  subscriptionActiveCount: number = 0;
  subscriptionOnHoldCount: number = 0;
  subscriptionFortnightlyCount: number = 0;
  subscriptionMonthlyCount: number = 0;
  subsciptionsBagsPerMonthCount: number = 0;
  subsciptionsBagsPerFortnightlyCount: number = 0;
  subsciptionsBagsPerMonthlyCount: number = 0;

  orderProcessingCount: number = 0;
  orderOnHoldCount: number = 0;
  orderPendingPaymentCount: number = 0;

  giftSubscriptionCount: number = 0;
  giftSubscriptionFortnightlyCount: number = 0;
  giftSubscriptionMonthlyCount: number = 0;

  bagCounter: BagCounter;
}

class AboAboStatsService {
  private wooApiBaseUrl = "https://maridalenbrenneri.no/wp-json/wc/v2/";
  private wooSubscriptionApiBaseUrl =
    "https://maridalenbrenneri.no/wp-json/wc/v1/";

  private subscriptions: Array<any> = [];
  private stats: Stats;

  async getStats() {
    return StatsModel.getStats().then(stats => {
      return {
        data: JSON.parse(stats.data),
        lastUpdated: stats.lastUpdated
      };
    });
  }

  /* Get stats from Woo and save in app db */
  async importStats() {
    const statsData = await this.getStatsDataFromWoo();
    return StatsModel.updateStats(statsData).then(() => {
      return this.getStats();
    });
  }

  getOrderStats = async () => {
    const dbOrders = await OrderModel.getOrders({});
    const orders = dbOrders.map((order: OrderModel) =>
      orderService.mapToClientModel(order)
    );
    return orders;
  };

  private async getStatsDataFromWoo() {
    this.stats = new Stats();
    this.stats.bagCounter = new BagCounter();
    this.stats.bagCounter.fortnightly = new Counter();
    this.stats.bagCounter.monthly = new Counter();
    this.subscriptions = [];

    let page = 1;
    do {
      page = await this.getSubscriptionsFromWoo(page);
    } while (page != 1);

    await this.getOrdersInPendingPayment();
    await this.getOrdersInProcess();
    await this.getOrdersOnHold();
    await this.getGiftSubscriptions();

    return this.stats;
  }

  private async getGiftSubscriptions() {
    let activeGiftSubscriptions = await giftSubscriptionService.getGiftSubscriptions();

    for (const sub of activeGiftSubscriptions) {
      const bags = sub.quantity;
      const isFortnighlty = sub.type == 2;
      this.updateBagCounter(bags, isFortnighlty);

      if (isFortnighlty) {
        this.stats.subsciptionsBagsPerFortnightlyCount += bags;
        this.stats.subsciptionsBagsPerMonthCount += bags * 2;
        this.stats.giftSubscriptionFortnightlyCount++;
      } else {
        this.stats.subsciptionsBagsPerMonthlyCount += bags;
        this.stats.subsciptionsBagsPerMonthCount += bags;
        this.stats.giftSubscriptionMonthlyCount++;
      }
    }

    this.stats.giftSubscriptionCount = activeGiftSubscriptions.length;
  }

  private getSubscriptionsFromWoo(page: number = 1) {
    const self = this;
    const url =
      this.wooSubscriptionApiBaseUrl +
      "subscriptions?page=" +
      page +
      "&" +
      process.env.WOO_SECRET_PARAM +
      "&per_page=30";

    return new Promise<any>(function(resolve, reject) {
      const request = require("request");
      request({ url: url, timeout: 60 * 5 * 1000 }, function(
        error: any,
        response: { body: any; headers: any }
      ) {
        if (error) {
          return reject(error);
        }

        const fetchedSubs = JSON.parse(response.body);
        self.subscriptions = self.subscriptions.concat(fetchedSubs);

        if (response.headers["x-wp-totalpages"] === `${page}`) {
          self.setSubscriptionData();
          return resolve(1);
        } else {
          console.log(
            "Not yet done, " +
              page +
              " / " +
              response.headers["x-wp-totalpages"]
          );
          return resolve(page + 1);
        }
      });
    });
  }

  private setSubscriptionData() {
    const self = this;

    const activeSubscriptions = self.subscriptions.filter(
      s => s.status === "active"
    );

    self.stats.subscriptionActiveCount = activeSubscriptions.length;
    self.stats.subscriptionOnHoldCount = self.subscriptions.filter(
      s => s.status === "on-hold"
    ).length;

    for (const sub of activeSubscriptions) {
      if (!sub.line_items || sub.line_items.length === 0) {
        continue;
      }
      const item = sub.line_items[0];

      if (item.name.includes("Annenhver uke")) {
        self.stats.subscriptionFortnightlyCount++;
        const numberOfBags = self.resolveNumberOfBags(item.name, true);
        self.stats.subsciptionsBagsPerFortnightlyCount += numberOfBags;
        self.stats.subsciptionsBagsPerMonthCount += numberOfBags * 2;
      } else {
        self.stats.subscriptionMonthlyCount++;
        const numberOfBags = self.resolveNumberOfBags(item.name, false);
        self.stats.subsciptionsBagsPerMonthlyCount += numberOfBags;
        self.stats.subsciptionsBagsPerMonthCount += numberOfBags;
      }
    }
  }

  private getOrdersInProcess() {
    const self = this;
    const url =
      this.wooApiBaseUrl +
      "orders?" +
      process.env.WOO_SECRET_PARAM +
      "&per_page=100" +
      "&status=processing";

    return new Promise<any>(function(resolve, reject) {
      const request = require("request");
      request(url, function(error: any, response: { body: any }) {
        if (error) {
          return reject(error);
        }

        self.stats.orderProcessingCount = JSON.parse(response.body).length;

        resolve(true);
      });
    });
  }

  private getOrdersOnHold() {
    const self = this;
    const url =
      this.wooApiBaseUrl +
      "orders?" +
      process.env.WOO_SECRET_PARAM +
      "&per_page=100" +
      "&status=on-hold";

    return new Promise<any>(function(resolve, reject) {
      const request = require("request");
      request(url, function(error: any, response: { body: any }) {
        if (error) {
          return reject(error);
        }

        self.stats.orderOnHoldCount = JSON.parse(response.body).length;

        resolve(true);
      });
    });
  }

  private getOrdersInPendingPayment() {
    const self = this;
    const url =
      this.wooApiBaseUrl +
      "orders?" +
      process.env.WOO_SECRET_PARAM +
      "&per_page=100" +
      "&status=pending";

    return new Promise<any>(function(resolve, reject) {
      const request = require("request");
      request(url, function(error: any, response: { body: any }) {
        if (error) {
          return reject(error);
        }

        self.stats.orderPendingPaymentCount = JSON.parse(response.body).length;

        resolve(true);
      });
    });
  }

  private resolveNumberOfBags(name, isFortnigthly) {
    for (let i = 1; i <= 8; i++) {
      if (name.includes(`- ${i}`)) {
        return this.updateBagCounter(i, isFortnigthly);
      }
    }

    console.log(`Number of bags not supported, name: ${name}`);
    return 0;
  }

  private updateBagCounter(bagsToAdd: number, isFortnigthly: boolean) {
    if (bagsToAdd === 1) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.one += 1;
      } else {
        this.stats.bagCounter.monthly.one += 1;
      }
      return 1;
    }

    if (bagsToAdd === 2) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.two += 1;
      } else {
        this.stats.bagCounter.monthly.two += 1;
      }
      return 2;
    }

    if (bagsToAdd === 3) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.three += 1;
      } else {
        this.stats.bagCounter.monthly.three += 1;
      }
      return 3;
    }

    if (bagsToAdd === 4) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.four += 1;
      } else {
        this.stats.bagCounter.monthly.four += 1;
      }
      return 4;
    }

    if (bagsToAdd === 5) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.five += 1;
      } else {
        this.stats.bagCounter.monthly.five += 1;
      }
      return 5;
    }

    if (bagsToAdd === 6) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.six += 1;
      } else {
        this.stats.bagCounter.monthly.six += 1;
      }
      return 6;
    }

    if (bagsToAdd === 7) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.seven += 1;
      } else {
        this.stats.bagCounter.monthly.seven += 1;
      }
      return 7;
    }

    if (bagsToAdd === 8) {
      if (isFortnigthly) {
        this.stats.bagCounter.fortnightly.eight += 1;
      } else {
        this.stats.bagCounter.monthly.eight += 1;
      }
      return 8;
    }

    throw new Error("Not supported bag count");
  }
}

export default new AboAboStatsService();
