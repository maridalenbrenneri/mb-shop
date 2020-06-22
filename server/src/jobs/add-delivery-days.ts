require("dotenv").config();

import DeliveryDayModel from "../database/models/delivery-day-model";

const DELIVERY_DAYS = [
  { date: new Date("2020-07-13"), type: "normal" },
  { date: new Date("2020-07-20"), type: "fortnightly" },
  { date: new Date("2020-07-27"), type: "normal" },
  { date: new Date("2020-08-03"), type: "monthly" },
  { date: new Date("2020-08-10"), type: "normal" },
  { date: new Date("2020-08-17"), type: "fortnightly" },
  { date: new Date("2020-08-24"), type: "normal" },
  { date: new Date("2020-08-31"), type: "monthly" },
  { date: new Date("2020-09-07"), type: "normal" },
  { date: new Date("2020-09-14"), type: "fortnightly" },
  { date: new Date("2020-09-21"), type: "normal" },
  { date: new Date("2020-09-28"), type: "normal" },
  { date: new Date("2020-10-05"), type: "monthly" },
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
