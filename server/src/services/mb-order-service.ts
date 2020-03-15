import MbOrderModel from "../database/models/mb-order-model";
import { OrderStatus } from "../../../shared/constants";

class MbOrderService {
  async createOrder(mbOrder: any) {
    mbOrder.status = OrderStatus.processing;
    const order = await MbOrderModel.createMbOrder(this.mapToDbModel(mbOrder));
    return this.mapToClientModel(order);
  }

  async updateOrder(mbOrder: any) {
    const mbOrderToUpdate = this.mapToDbModel(mbOrder);
    const order = await MbOrderModel.updateMbOrder(mbOrder.id, mbOrderToUpdate);
    return this.mapToClientModel(order);
  }

  async getOrder(mbOrderId: number) {
    const order = await MbOrderModel.getMbOrder(mbOrderId);
    return this.mapToClientModel(order);
  }

  async getOrders(status: string = "") {
    const orders = await MbOrderModel.getMbOrders();
    return orders.map(mbOrder => this.mapToClientModel(mbOrder));
  }

  async updateOrderStatus(mbOrderId: number, newStatus: string) {
    const order = await MbOrderModel.getMbOrder(mbOrderId);
    if (!order) return null;
    const updatedOrder = await MbOrderModel.updateMbOrderStatus(
      order.id,
      newStatus
    );
    return this.mapToClientModel(updatedOrder);
  }

  mapToDbModel = function(mbOrder: any) {
    return {
      orderDate: mbOrder.orderDate || Date.now(),
      deliveryDate: mbOrder.deliveryDate || Date.now(),
      status: mbOrder.status,
      externalCustomerNumber: mbOrder.customer.customerNumber,
      customer: JSON.stringify(mbOrder.customer),
      coffeeItems: JSON.stringify(mbOrder.coffeeItems),
      freight: mbOrder.freight,
      notes: mbOrder.notes,
      subscriptionId: mbOrder.subscriptionId
    };
  };

  mapToClientModel = function(mbOrder: any) {
    return {
      id: mbOrder.id,
      orderDate: mbOrder.orderDate,
      deliveryDate: mbOrder.deliveryDate,
      status: mbOrder.status,
      customer: JSON.parse(mbOrder.customer),
      coffeeItems: JSON.parse(mbOrder.coffeeItems),
      freight: mbOrder.freight,
      notes: mbOrder.notes,
      subscriptionId: mbOrder.subscriptionId
    };
  };
}

export default new MbOrderService();
