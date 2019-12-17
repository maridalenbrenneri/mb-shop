import {
  Sequelize,
  Model,
  STRING,
  BOOLEAN,
  TEXT,
  INTEGER,
  DATE
} from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class OrderModel extends Model {
  public static getOrder = function(orderId: Number) {
    return OrderModel.findByPk(orderId as any);
  };

  public static getOrders = function(filter: any) {
    filter = filter || {};
    filter.isDeleted = false;

    return OrderModel.findAll({
      where: filter,
      order: [["createdAt", "DESC"]]
    });
  };

  public static getSubscriptionParentOrders = function() {
    return OrderModel.getOrders({
      subscriptionData: {
        //   [sequelize.Op.ne]: null
      }
    });
  };

  public static createOrder = function(order) {
    return OrderModel.create(order);
  };

  public static updateOrder = function(orderId, order) {
    return OrderModel.findByPk(orderId).then(dbOrder => {
      return dbOrder.update(order);
    });
  };

  public static updateOrderStatus = function(orderId, newStatus) {
    return OrderModel.findByPk(orderId).then(order => {
      return order.update({
        status: newStatus
      });
    });
  };

  public static addOrderNote = function(orderId: number, orderNotes: string) {
    return OrderModel.findByPk(orderId).then(order => {
      return order.update({
        notes: orderNotes
      });
    });
  };

  public static addCustomerOrderNote = function(
    orderId: number,
    customerOrderNotes: string
  ) {
    return OrderModel.findByPk(orderId).then(order => {
      return order.update({
        customerNotes: customerOrderNotes
      });
    });
  };
}

OrderModel.init(
  {
    orderDate: { type: DATE, allowNull: false },
    deliveryDate: { type: DATE, allowNull: true },
    status: { type: STRING, allowNull: false },
    customer: { type: TEXT },
    items: { type: TEXT },
    notes: { type: TEXT },
    customerNotes: { type: TEXT },
    parentOrderId: { type: INTEGER.UNSIGNED }, // todo: to be removed
    subscriptionParentOrderId: { type: INTEGER.UNSIGNED },
    subscriptionData: { type: TEXT }, // to be removed ?
    type: { type: STRING }, // todo: to be removed
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "order"
  }
);
