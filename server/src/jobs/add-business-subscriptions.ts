require("dotenv").config();

import BusinessSubscriptionModel from "../database/models/business-subscription-model";

const SUBSCRIPTIONS = [
  {
    customerId: "10008",
    customerName: "Arundo",
    status: "active",
    frequence: 2,
    quantityKg: 2
  },
  {
    customerId: "10046",
    customerName: "Corrientes",
    status: "active",
    frequence: 2,
    quantityKg: 0.5,
    note: "Lokal"
  },
  {
    customerId: "10036",
    customerName: "Eco-1",
    status: "active",
    frequence: 2,
    quantityKg: 4.8,
    note: "Lokal"
  },
  {
    customerId: "10037",
    customerName: "Qvartz",
    status: "active",
    frequence: 1,
    quantityKg: 3.5
  },
  {
    customerId: "10063",
    customerName: "Hent",
    status: "active",
    frequence: 2,
    quantityKg: 12
  },
  {
    customerId: "10068",
    customerName: "Grådig",
    status: "active",
    frequence: 2,
    quantityKg: 6
  }
];

const add = () => {
  for (let i = 0; i < SUBSCRIPTIONS.length; i++) {
    BusinessSubscriptionModel.create(SUBSCRIPTIONS[i]);
  }
};

add();
