import BusinessSubscriptionModel from "../database/models/business-subscription-model";
import { Op } from "sequelize";
import deliveryDayService from "./delivery-day-service";
import coffeeService from "./coffee-service";
import mbOrderService from "./mb-order-service";
import { CoffeePrizes } from "../../../shared/constants";

interface ICoffee {
  id: number;
  code: string;
}

interface ICoffeeItem {
  coffee: ICoffee;
  quantity: number;
  variationId: number;
  price: number;
}

interface IItem {
  coffee: number;
  count: number;
}

class BusinessSubscriptionService {
  getSubscriptions = async function() {
    let self = this;
    let filter = {
      [Op.or]: [{ status: "active" }, { status: "paused" }]
    };

    const subscriptions = await BusinessSubscriptionModel.getSubscriptions(
      filter
    );
    return subscriptions.map((c: any) => self.mapToClientModel(c));
  };

  updateSubscription = async function(subscription: any) {
    let self = this;
    let dbSubscription = self.mapToDbModel(subscription);

    return BusinessSubscriptionModel.updateSubscription(
      dbSubscription.id,
      dbSubscription
    ).then((updatedSubscription: any) => {
      return self.mapToClientModel(updatedSubscription);
    });
  };

  createSubscription = async function(subscription: any) {
    let self = this;
    let dbSubscription = self.mapToDbModel(subscription);

    return BusinessSubscriptionModel.createSubscription(dbSubscription).then(
      (updatedSubscription: any) => {
        return self.mapToClientModel(updatedSubscription);
      }
    );
  };

  createOrderForSubscription = async function(
    subscription: any,
    customer: any
  ) {
    const order = {
      externalCustomerNumber: subscription.customerId,
      customer: customer,
      coffeeItems: undefined,
      notes: subscription.note,
      subscriptionId: subscription.id,
      freight: 0
    };

    const day = await deliveryDayService.getNextDeliveryDay();

    if (day.type === "normal") {
      throw new Error(
        "Cannot create order because next delivery day is not a subscription delivery day"
      );
    }
    if (!day.coffee1 || !day.coffee2 || !day.coffee3 || !day.coffee4) {
      throw new Error(
        "Cannot create order from subscription because coffees was not set for next subscription delivery day"
      );
    }

    const coffee1 = await coffeeService.getCoffee(day.coffee1);
    const coffee2 = await coffeeService.getCoffee(day.coffee2);
    const coffee3 = await coffeeService.getCoffee(day.coffee3);
    const coffee4 = await coffeeService.getCoffee(day.coffee4);

    let coffeeItems = new Array<any>();

    if (subscription.quantity250 > 0)
      coffeeItems = coffeeItems.concat(
        this.resolveCoffeeItems(
          1,
          subscription.quantity250,
          coffee1,
          coffee2,
          coffee3,
          coffee4
        )
      );

    if (subscription.quantity500 > 0)
      coffeeItems = coffeeItems.concat(
        this.resolveCoffeeItems(
          2,
          subscription.quantity500,
          coffee1,
          coffee2,
          coffee3,
          coffee4
        )
      );

    if (subscription.quantity1200 > 0)
      coffeeItems = coffeeItems.concat(
        this.resolveCoffeeItems(
          3,
          subscription.quantity1200,
          coffee1,
          coffee2,
          coffee3,
          coffee4
        )
      );

    order.coffeeItems = coffeeItems;

    const newOrder = await mbOrderService.createOrder(order);

    subscription.lastOrderId = newOrder.id;
    subscription.lastOrderCreated = newOrder.orderDate;

    await this.updateSubscription(subscription);

    return newOrder;
  };

  resolveCoffeeItems = function(
    variationId: number,
    quantity: number,
    coffee1: any,
    coffee2: any,
    coffee3: any,
    coffee4: any
  ) {
    let coffee1count = 0;
    let coffee2count = 0;
    let coffee3count = 0;
    let coffee4count = 0;

    let i = 0;
    let coffee = 1;

    while (i < quantity) {
      switch (coffee) {
        case 1:
          coffee1count++;
          break;
        case 2:
          coffee2count++;
          break;
        case 3:
          coffee3count++;
          break;
        case 4:
          coffee4count++;
          break;
      }
      i++;
      coffee++;
      if (coffee > 4) coffee = 1;
    }

    let price = 0;

    if (variationId === 1) price = CoffeePrizes._250;
    if (variationId === 2) price = CoffeePrizes._500;
    if (variationId === 3) price = CoffeePrizes._1200;

    const items = [];
    if (coffee1count > 0)
      items.push({
        coffee: coffee1,
        quantity: coffee1count,
        variationId,
        price
      });
    if (coffee2count > 0)
      items.push({
        coffee: coffee2,
        quantity: coffee2count,
        variationId,
        price
      });
    if (coffee3count > 0)
      items.push({
        coffee: coffee3,
        quantity: coffee3count,
        variationId,
        price
      });
    if (coffee4count > 0)
      items.push({
        coffee: coffee4,
        quantity: coffee4count,
        variationId,
        price
      });

    return items;
  };

  mapToClientModel = function(subscription: any) {
    return {
      id: subscription.id,
      customerId: subscription.customerId,
      customerName: subscription.customerName,
      name: subscription.name,
      status: subscription.status,
      frequence: subscription.frequence,
      quantityKg: subscription.quantityKg,
      quantity250: subscription.quantity250,
      quantity500: subscription.quantity500,
      quantity1200: subscription.quantity1200,
      lastOrderCreated: subscription.lastOrderCreated,
      lastOrderId: subscription.lastOrderId,
      note: subscription.note
    };
  };

  mapToDbModel = function(subscription: any) {
    return {
      id: subscription.id,
      customerId: subscription.customerId,
      customerName: subscription.customerName,
      name: subscription.name,
      status: subscription.status,
      frequence: subscription.frequence,
      quantityKg: subscription.quantityKg,
      quantity250: subscription.quantity250,
      quantity500: subscription.quantity500,
      quantity1200: subscription.quantity1200,
      lastOrderCreated: subscription.lastOrderCreated,
      lastOrderId: subscription.lastOrderId,
      note: subscription.note
    };
  };
}

export default new BusinessSubscriptionService();
