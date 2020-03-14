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
  public static getSubscriptions = function(filter: any) {
    filter = filter || {};
    filter.isDeleted = false;

    return BusinessSubscriptionModel.findAll({
      where: filter,
      order: [["customerName", "asc"]]
    });
  };

  public static createSubscription = function(subscription: any) {
    return BusinessSubscriptionModel.create(subscription);
  };

  public static updateSubscription = function(
    subscriptionId: number,
    subscription: any
  ) {
    return BusinessSubscriptionModel.findByPk(subscriptionId).then(
      (dbSubscription: any) => {
        return dbSubscription.update(subscription);
      }
    );
  };
}

BusinessSubscriptionModel.init(
  {
    customerId: { type: STRING, allowNull: false }, // Fiken customer number
    customerName: { type: STRING }, // From Fiken
    status: { type: STRING, allowNull: false },
    frequence: { type: INTEGER.UNSIGNED, allowNull: false },

    quantityKg: { type: FLOAT.UNSIGNED, allowNull: false, defaultValue: 0 }, // Obsolete

    quantity250: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    quantity500: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    quantity1200: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },

    note: { type: STRING },
    lastOrderCreated: { type: DATE },
    lastOrderId: { type: INTEGER },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "business-subscription"
  }
);
