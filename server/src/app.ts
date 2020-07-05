import * as express from "express";
import { Response, Request } from "express";
import * as bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import logger from "./utils/logger";
import { ValidationError } from "./models/validation-error";

// Load environemnt variables
require("dotenv").config();

function isAuthenticated(req: Request, res: Response, next: any): Boolean {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send();
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err || !decoded) {
      return res.status(401).send();
    }

    req.user = {
      id: decoded.id,
    };

    return next();
  });
}

function isUserInSuperuser(req: Request, res: Response, next: any): Boolean {
  // todo: when more users are added, implement...

  return isAuthenticated(req, res, next);
}

function isUserInAdmin(req: Request, res: Response, next: any): Boolean {
  // todo: when more users are added, implement...

  return isAuthenticated(req, res, next);
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set allowed origin
app.use(function (req: Request, res: Response, next: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  // res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200");
  // res.setHeader('Access-Control-Allow-Origin', "http://localhost:5001");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", [
    "content-type",
    "x-access-token",
  ]);
  next();
});

import dashboardController from "./controllers/dashboard";
import authController from "./controllers/auth";
import customerController from "./controllers/customer";
import coffeeController from "./controllers/coffee";
import orderController from "./controllers/order";
import giftSubscriptionController from "./controllers/gift-subscription";
import shippingController from "./controllers/shipping";
import deliveryDaysController from "./controllers/delivery-day";
import subscriptionController from "./controllers/subscription";
import wooController from "./controllers/woo";

/*** API ***/

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (err instanceof ValidationError) {
      return res.status(422).send({ validationError: err.message });
    }

    logger.error(err.message);

    return res.status(500).send(err.message);
  });
};

// Dashboard/Stats routes

app.get("/api/stats/data", asyncMiddleware(dashboardController.getData));
app.get(
  "/api/stats/orders",
  isUserInAdmin,
  asyncMiddleware(dashboardController.getOrderStats)
);
app.get(
  "/api/stats/subscriptionCoffeeTypeCounter",
  isUserInAdmin,
  asyncMiddleware(dashboardController.getSubscriptionCoffeeTypeCounter)
);
app.get(
  "/api/stats/coffees",
  isUserInAdmin,
  asyncMiddleware(dashboardController.getCurrentCoffees)
);
app.get(
  "/api/stats/deliverydays",
  isUserInAdmin,
  asyncMiddleware(dashboardController.getNextDeliveryDays)
);

// Woo
// NOTE: import must be "open" for scheduled heroku job (TODO: should be triggered in some other way)
app.get("/api/woo/import", asyncMiddleware(wooController.importWooData));
app.get("/api/woo/data", asyncMiddleware(wooController.getWooData));

// User and auth
app.post("/api/authenticate", asyncMiddleware(authController.authenticate));
app.get(
  "/api/users/me",
  isAuthenticated,
  asyncMiddleware(authController.getMe)
);
app.get("/api/users", isUserInAdmin, asyncMiddleware(authController.getUsers));

// Shipping (Integration with Cargonizer)
app.post(
  "/api/shipping/ship-business-order",
  isUserInSuperuser,
  asyncMiddleware(shippingController.CreateConsignmentForBusinessOrder)
);
app.post(
  "/api/shipping/ship-gift-subscription",
  isUserInSuperuser,
  asyncMiddleware(shippingController.CreateConsignmentForGiftSubscription)
);

// Gift subscriptions (Integration with Woo)
app.get(
  "/api/giftsubscriptions",
  isUserInSuperuser,
  asyncMiddleware(giftSubscriptionController.getGiftSubscriptions)
);
app.put(
  "/api/giftsubscriptions/:id/first-delivery-date",
  isUserInSuperuser,
  asyncMiddleware(giftSubscriptionController.setFirstDeliveryDate)
);

// Customers
app.get("/api/customers", asyncMiddleware(customerController.getCustomers));

// Delivery days
app.get(
  "/api/deliverydays",
  asyncMiddleware(deliveryDaysController.getDeliveryDays)
);
app.post(
  "/api/deliverydays",
  isUserInSuperuser,
  asyncMiddleware(deliveryDaysController.createDeliveryDay)
);
app.put(
  "/api/deliverydays/:id",
  isUserInSuperuser,
  asyncMiddleware(deliveryDaysController.updateDeliveryDay)
);

// Coffees
app.get("/api/coffees", asyncMiddleware(coffeeController.getCoffees));
app.get("/api/coffees/:id", asyncMiddleware(coffeeController.getCoffee));
app.post(
  "/api/coffees",
  isUserInSuperuser,
  asyncMiddleware(coffeeController.createCoffee)
);
app.put(
  "/api/coffees/:id",
  isUserInSuperuser,
  asyncMiddleware(coffeeController.updateCoffee)
);

// Business subscriptions
app.get("/api/subscriptions", subscriptionController.getSubscriptions);
app.put(
  "/api/subscriptions/:id",
  isUserInSuperuser,
  asyncMiddleware(subscriptionController.updateSubscription)
);
app.post(
  "/api/subscriptions",
  isUserInSuperuser,
  asyncMiddleware(subscriptionController.createSubscription)
);
app.post(
  "/api/subscriptions/createorder",
  isUserInSuperuser,
  asyncMiddleware(subscriptionController.createOrderFromSubscription)
);

// Orders
app.get(
  "/api/orders",
  isUserInSuperuser,
  asyncMiddleware(orderController.getOrders)
);
app.put(
  "/api/orders/:id",
  isUserInSuperuser,
  asyncMiddleware(orderController.updateOrder)
);
app.get(
  "/api/orders/:id",
  isAuthenticated,
  asyncMiddleware(orderController.getOrders)
);
app.post(
  "/api/orders",
  isUserInSuperuser,
  asyncMiddleware(orderController.createOrder)
);
app.post(
  "/api/orders/:id/complete",
  isUserInSuperuser,
  asyncMiddleware(orderController.completeOrder)
);
app.post(
  "/api/orders/:id/cancel",
  isUserInSuperuser,
  asyncMiddleware(orderController.cancelOrder)
);
app.post(
  "/api/orders/:id/process",
  isUserInSuperuser,
  asyncMiddleware(orderController.processOrder)
);
app.post(
  "/api/orders/:id/invoice",
  isUserInSuperuser,
  asyncMiddleware(orderController.createInvoice)
);

app.get("/api", function (_req: Request, res: Response) {
  res.send("Maridalen Brenneri Backoffice API");
});

/*** END API ***/

/*** CLIENT ***/

app.use(express.static(__dirname + "/../../client/dist/mb-shop"));

app.get("/", function (_req, res) {
  res.sendFile(__dirname + "/../../client/dist/mb-shop/index.html");
});

app.get("/*", function (_req, res) {
  res.redirect("/");
});

/*** END CLIENT ***/

// Error handling - IS THIS IN USE? DONT THINK SO...
app.use(function (err: any, req: any, res: any, next: any) {
  if (err instanceof ValidationError) {
    return res.status(422).send({ validationError: err.message });
  }

  logger.error(err.message);
  return res.status(500).send({ error: err.message });
});

console.debug("NODE_ENV: " + process.env.NODE_ENV);
console.debug("DATABASE_URL: " + process.env.DATABASE_URL);

export default app;
