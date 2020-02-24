import BusinessSubscriptionModel from "../database/models/business-subscription-model";

class BusinessSubscriptionService {
  getSubscriptions = async function() {
    let self = this;
    let filter = { status: "active" };

    const subscriptions = await BusinessSubscriptionModel.getSubscriptions(
      filter
    );
    return subscriptions.map(c => self.mapToClientModel(c));
  };

  mapToClientModel = function(subscription) {
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
