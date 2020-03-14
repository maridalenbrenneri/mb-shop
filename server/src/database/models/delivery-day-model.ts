import {
  Sequelize,
  Model,
  STRING,
  BOOLEAN,
  DATE,
  INTEGER,
  Op
} from "sequelize";
import moment = require("moment");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class DeliveryDayModel extends Model {
  public static getDeliveryDay = function(id: Number) {
    return DeliveryDayModel.findByPk(id as any);
  };

  public static getDeliveryDays = function(filter: any = null) {
    filter = filter || {};
    filter.isDeleted = false;

    return DeliveryDayModel.findAll({ where: filter, order: ["date"] });
  };

  public static updateDeliveryDay = function(id, deliveryDay) {
    return DeliveryDayModel.findByPk(id).then(dbDeliveryDay => {
      return dbDeliveryDay.update(deliveryDay);
    });
  };

  public static getNextDeliveryDay = function() {
    return DeliveryDayModel.findOne({
      where: {
        date: {
          [Op.or]: {
            [Op.gte]: moment()
              .subtract(6, "days")
              .toDate(),
            [Op.lt]: moment()
              .add(6, "days")
              .toDate()
          }
        }
      }
    });
  };
}

DeliveryDayModel.init(
  {
    date: { type: DATE, allowNull: false },
    type: { type: STRING, allowNull: false },
    coffee1: { type: INTEGER, allowNull: true },
    coffee2: { type: INTEGER, allowNull: true },
    coffee3: { type: INTEGER, allowNull: true },
    coffee4: { type: INTEGER, allowNull: true },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "deliveryDay"
  }
);
