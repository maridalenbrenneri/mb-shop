require("dotenv").config();

import DeliveryDayModel from "../database/models/delivery-day-model";

const DELIVERY_DAYS = [
  // { date: new Date("2020-05-11"), type: "normal" },
  // { date: new Date("2020-05-18"), type: "fortnightly" },
  // { date: new Date("2020-05-25"), type: "normal" },
  // { date: new Date("2020-06-01"), type: "monthly" },
  // { date: new Date("2020-06-08"), type: "normal" },
  // { date: new Date("2020-06-15"), type: "fortnightly" },
  // { date: new Date("2020-05-22"), type: "normal" },
  // { date: new Date("2020-06-29"), type: "normal" },
  // { date: new Date("2020-07-06"), type: "monthly" }
];

const add = () => {
  for (let i = 0; i < DELIVERY_DAYS.length; i++) {
    DeliveryDayModel.create({
      date: DELIVERY_DAYS[i].date,
      type: DELIVERY_DAYS[i].type
    });
  }
};

add();
