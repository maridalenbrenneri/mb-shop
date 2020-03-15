import {
  Sequelize,
  Model,
  STRING,
  BOOLEAN,
  TEXT,
  DATE,
  INTEGER
} from "sequelize";
import { OrderStatus } from "../../../../shared/constants";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class MbOrderModel extends Model {
  public static getMbOrder = function(orderId: Number) {
    return MbOrderModel.findByPk(orderId as any);
  };

  public static getMbOrders = function(status: string) {
    // TODO: handel status input filter (nneds to be done from client down)
    status = status || OrderStatus.processing;

    const filter = {
      isDeleted: false
    };

    return MbOrderModel.findAll({
      where: filter,
      order: [["createdAt", "DESC"]]
    });
  };

  public static createMbOrder = function(order) {
    return MbOrderModel.create(order);
  };

  public static updateMbOrder = function(orderId, order) {
    return MbOrderModel.findByPk(orderId).then(dbOrder => {
      return dbOrder.update(order);
    });
  };

  public static updateMbOrderStatus = function(orderId, newStatus) {
    return MbOrderModel.findByPk(orderId).then(order => {
      return order.update({
        status: newStatus
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
    freight: { type: INTEGER, allowNull: false, defaultValue: 0 },
    subscriptionId: { type: INTEGER }, // set if created from subscription
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "mb-order"
  }
);
