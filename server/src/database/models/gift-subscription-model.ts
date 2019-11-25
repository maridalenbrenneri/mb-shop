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

export default class GiftSubscriptionModel extends Model {
  public static getGiftSubscription = function(giftSubscriptionId) {
    return GiftSubscriptionModel.findByPk(giftSubscriptionId);
  };

  public static getGiftSubscriptions = function(filter) {
    filter = filter || {};
    filter.isDeleted = false;

    return GiftSubscriptionModel.findAll({
      where: filter,
      order: [["wooOrderNumber", "DESC"]]
    });
  };

  public static createGiftSubscription = function(giftSubscription) {
    return GiftSubscriptionModel.create(giftSubscription);
  };

  public static updateGiftSubscription = function(
    giftSubscriptionId,
    giftSubscription
  ) {
    return GiftSubscriptionModel.findByPk(giftSubscriptionId).then(
      dbGiftSubscription => {
        return dbGiftSubscription.update(giftSubscription);
      }
    );
  };
}

GiftSubscriptionModel.init(
  {
    status: { type: STRING, allowNull: false },
    wooOrderId: { type: INTEGER.UNSIGNED, allowNull: false },
    wooOrderNumber: { type: INTEGER.UNSIGNED, allowNull: false },
    orderDate: { type: DATE, allowNull: false },
    originalFirstDeliveryDate: { type: DATE, allowNull: false }, // The date-time entered by customer (defaults to order date)
    firstDeliveryDate: { type: DATE, allowNull: false }, // The calculated and actual first delivery date
    lastDeliveryDate: { type: DATE, allowNull: false }, // We save last delivery date to make it possible to change (could else be calculated with numberOfMonths)
    numberOfMonths: { type: INTEGER.UNSIGNED, allowNull: false },
    frequence: { type: INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: INTEGER.UNSIGNED, allowNull: false },
    customerId: { type: INTEGER.UNSIGNED },
    customerName: { type: STRING },
    recipient_name: { type: STRING, allowNull: false },
    recipient_email: { type: STRING, allowNull: false },
    recipient_address: { type: TEXT, allowNull: false },
    message_to_recipient: { type: TEXT },
    note: { type: STRING },
    lastOrderCreated: { type: DATE },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "gift-subscription"
  }
);
