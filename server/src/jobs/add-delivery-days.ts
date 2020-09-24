require("dotenv").config();

import DeliveryDayModel from "../database/models/delivery-day-model";

const DELIVERY_DAYS = [
  { date: new Date("2020-10-19"), type: "fortnightly" },
  { date: new Date("2020-10-26"), type: "normal" },
  { date: new Date("2020-11-02"), type: "monthly" },
  { date: new Date("2020-11-09"), type: "normal" },
  { date: new Date("2020-11-16"), type: "fortnightly" },
  { date: new Date("2020-11-23"), type: "normal" },
  { date: new Date("2020-11-30"), type: "monthly" },
  { date: new Date("2020-12-07"), type: "normal" },
  { date: new Date("2020-12-14"), type: "fortnightly" },
  { date: new Date("2020-12-21"), type: "normal" },
  { date: new Date("2020-12-28"), type: "normal" },
  { date: new Date("2021-01-04"), type: "monthly" },
  { date: new Date("2021-01-11"), type: "normal" },
  { date: new Date("2021-01-18"), type: "fortnightly" },
  { date: new Date("2021-01-25"), type: "normal" },
  { date: new Date("2021-02-01"), type: "monthly" },
];

const add = () => {
  for (let i = 0; i < DELIVERY_DAYS.length; i++) {
    DeliveryDayModel.create({
      date: DELIVERY_DAYS[i].date,
      type: DELIVERY_DAYS[i].type,
    });
  }
};

add();
