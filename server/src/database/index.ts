require("dotenv").config();

import UserModel from "./models/user-model";
import CustomerModel from "./models/customer-model";
import GiftSubscriptionModel from "./models/gift-subscription-model";
import ProductModel from "./models/product-model";
import StatsModel from "./models/stats-model";
import BusinessSubscriptionModel from "./models/business-subscription-model";
import CoffeeModel from "./models/coffee-model";
import MbOrderModel from "./models/mb-order-model";
import DeliveryDayModel from "./models/delivery-day-model";
import WooModel from "./models/woo-model";

// Run this to create / update database tables

const createTables = () => {
  console.log(`Creating/Alter tables in ${process.env.DATABASE_URL}`);

  // UserModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing UserModel")
  // );
  // CustomerModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing CustomerModel")
  // );
  // GiftSubscriptionModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing GiftSubscriptionModel")
  // );
  // ProductModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing ProductModel")
  // );
  // BusinessSubscriptionModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing BusinessSubscriptionModel")
  // );
  // StatsModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing StatsModel")
  // );
  // CoffeeModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing CoffeeModel")
  // );
  // MbOrderModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing MbOrderModel")
  // );
  // DeliveryDayModel.sync({ force: false, alter: true }).then(() =>
  //   console.log("Done syncing DeliveryDayModel")
  // );
  WooModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing WooModel")
  );
};

createTables();
