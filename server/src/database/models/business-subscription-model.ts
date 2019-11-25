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

export default class BusinessSubscriptionModel extends Model {}

BusinessSubscriptionModel.init(
  {
    customerId: { type: STRING, allowNull: false },
    customer: { type: TEXT, allowNull: false },
    status: { type: STRING, allowNull: false },
    orderDate: { type: DATE, allowNull: false },
    frequence: { type: INTEGER.UNSIGNED, allowNull: false },
    quantityBags: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    quantityKg: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    note: { type: STRING },
    lastOrderCreated: { type: DATE },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "business-subscription"
  }
);
