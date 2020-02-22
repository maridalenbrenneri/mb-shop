import { Sequelize, Model, STRING, BOOLEAN, TEXT, DATE } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class MbOrderModel extends Model {
  public static getMbOrder = function(orderId: Number) {
    return MbOrderModel.findByPk(orderId as any);
  };

  public static getMbOrders = function(filter: any) {
    filter = filter || {};
    filter.isDeleted = false;

    return MbOrderModel.findAll({
      where: filter,
      order: [["createdAt", "DESC"]]
    });
  };

  public static createMbOrder = function(order) {
    return MbOrderModel.create(order);
  };

  public static updateMbOrder = function(orderId, order) {
    return MbOrderModel.findByPk(orderId).then(dbMbOrder => {
      return dbMbOrder.update(order);
    });
  };

  public static updateMbOrderStatus = function(orderId, newStatus) {
    return MbOrderModel.findByPk(orderId).then(order => {
      return order.update({
        status: newStatus
      });
    });
  };

  public static addMbOrderNote = function(orderId: number, orderNotes: string) {
    return MbOrderModel.findByPk(orderId).then(order => {
      return order.update({
        notes: orderNotes
      });
    });
  };
}

MbOrderModel.init(
  {
    orderDate: { type: DATE, allowNull: false },
    deliveryDate: { type: DATE, allowNull: true },
    status: { type: STRING, allowNull: false },
    externalCustomerNumber: { type: STRING, allowNull: false },
    customer: { type: TEXT },
    coffeeItems: { type: TEXT },
    stashItems: { type: TEXT },
    notes: { type: TEXT },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "mb-order"
  }
);
