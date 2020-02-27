import BusinessSubscriptionModel from "../database/models/business-subscription-model";
import { Op } from "sequelize";

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

  mapToClientModel = function(subscription: any) {
    return {
      id: subscription.id,
      customerId: subscription.customerId,
      customerName: subscription.customerName,
      name: subscription.name,
      status: subscription.status,
      frequence: subscription.frequence,
      quantityKg: subscription.quantityKg,
      lastOrderCreated: subscription.lastOrderCreated,
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
      lastOrderCreated: subscription.lastOrderCreated,
      note: subscription.note
    };
  };
}

export default new BusinessSubscriptionService();
