require("dotenv").config();

import DeliveryDayModel from "../database/models/delivery-day-model";

const DELIVERY_DAYS = [
  { date: new Date("2020-03-02"), type: "monthly" },
  { date: new Date("2020-03-09"), type: "normal" },
  { date: new Date("2020-03-16"), type: "fortnightly" },
  { date: new Date("2020-03-23"), type: "normal" },
  { date: new Date("2020-03-30"), type: "normal" },
  { date: new Date("2020-04-06"), type: "monthly" },
  { date: new Date("2020-04-13"), type: "normal" },
  { date: new Date("2020-04-20"), type: "fortnightly" },
  { date: new Date("2020-04-27"), type: "normal" },
  { date: new Date("2020-05-04"), type: "monthly" }
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