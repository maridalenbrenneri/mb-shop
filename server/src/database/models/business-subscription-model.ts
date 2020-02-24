import {
  Sequelize,
  Model,
  STRING,
  BOOLEAN,
  INTEGER,
  DATE,
  FLOAT
} from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class BusinessSubscriptionModel extends Model {
  public static getSubscriptions = function(filter) {
    filter = filter || {};
    filter.isDeleted = false;

    return BusinessSubscriptionModel.findAll({ where: filter });
  };
}

BusinessSubscriptionModel.init(
  {
    customerId: { type: STRING, allowNull: false }, // Fiken customer number
    customerName: { type: STRING }, // From Fiken
    status: { type: STRING, allowNull: false },
    orderDate: { type: DATE, allowNull: false },
    frequence: { type: INTEGER.UNSIGNED, allowNull: false },
    quantityKg: { type: FLOAT.UNSIGNED, allowNull: false, defaultValue: 0 },
    note: { type: STRING },
    lastOrderCreated: { type: DATE },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "business-subscription"
  }
);
