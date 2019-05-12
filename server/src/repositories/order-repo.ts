import BaseRepo from "./base-repo";
import { orderModel } from "./models";

class OrderRepo extends BaseRepo {
  private Order = this.sequelize.define("order", orderModel);

  getOrder = function(orderId: Number) {
    return this.Order.findById(orderId);
  };

  getOrders = function(filter: any) {
    filter = filter || {};
    filter.isDeleted = false;

    return this.Order.findAll({
      where: filter,
      order: [["createdAt", "DESC"]]
    });
  };

  getSubscriptionParentOrders = function() {
    return this.getOrders({
      subscriptionData: {
        [this.sequelize.Op.ne]: null
      }
    });
  };

  createOrder = function(order) {
    return this.Order.create(order);
  };

  updateOrder = function(orderId, order) {
    return this.Order.findById(orderId).then(dbOrder => {
      return dbOrder.update(order);
    });
  };

  updateOrderStatus = function(orderId, newStatus) {
    return this.Order.findById(orderId).then(order => {
      return order.update({
        status: newStatus
      });
    });
  };

  addOrderNote = function(orderId: number, orderNotes: string) {
    return this.Order.findById(orderId).then(order => {
      return order.update({
        notes: orderNotes
      });
    });
  };

  addCustomerOrderNote = function(orderId: number, customerOrderNotes: string) {
    return this.Order.findById(orderId).then(order => {
      return order.update({
        customerNotes: customerOrderNotes
      });
    });
  };
}

export default new OrderRepo();
