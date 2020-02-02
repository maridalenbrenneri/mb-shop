require("dotenv").config();

import UserModel from "./models/user-model";
import OrderModel from "./models/order-model";
import CustomerModel from "./models/customer-model";
import GiftSubscriptionModel from "./models/gift-subscription-model";
import ProductModel from "./models/product-model";
import StatsModel from "./models/stats-model";
import BusinessSubscriptionModel from "./models/business-subscription-model";

// Run this to create / update database tables

const createTables = () => {
  console.log(`Creating/Alter tables in ${process.env.DATABASE_URL}`);

  UserModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing UserModel")
  );
  OrderModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing OrderModel")
  );
  CustomerModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing CustomerModel")
  );
  GiftSubscriptionModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing GiftSubscriptionModel")
  );
  ProductModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing ProductModel")
  );
  BusinessSubscriptionModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing BusinessSubscriptionModel")
  );
  StatsModel.sync({ force: false, alter: true }).then(() =>
    console.log("Done syncing StatsModel")
  );
};

createTables();