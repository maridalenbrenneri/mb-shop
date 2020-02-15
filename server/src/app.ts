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

  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err || !decoded) {
      return res.status(401).send();
    }

    req.user = {
      id: decoded.id
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
app.use(function(req: Request, res: Response, next: any) {
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
    "x-access-token"
  ]);
  next();
});

import dashboardController from "./controllers/dashboard";
import authController from "./controllers/auth";
import customerController from "./controllers/customer";
import productController from "./controllers/product";
import coffeeController from "./controllers/coffee";
import orderController from "./controllers/order";
import giftSubscriptionController from "./controllers/gift-subscription";
import shippingController from "./controllers/shipping";

/*** API ***/

// Dashboard / Stats routes
// app.get("/api/admin/create-tables", isUserInAdmin, adminController.createTable);
app.get("/api/aboabo/stats", dashboardController.getAboaboStats);
app.get("/api/aboabo/import", dashboardController.importAboaboStats);
app.get("/api/stats/orders", dashboardController.getOrderStats);
app.get("/api/stats/deliverydays", dashboardController.getNextDeliveryDays);
app.get(
  "/api/stats/quanitites",
  dashboardController.calculateDeliveryQuantities
);

// User and auth
app.post("/api/authenticate", authController.authenticate);
app.get("/api/users/me", isAuthenticated, authController.getMe);
app.get("/api/users", isUserInAdmin, authController.getUsers);

// Shipping (Integration with Cargonizer)
app.post(
  "/api/shipping/ship-business-order",
  isUserInSuperuser,
  shippingController.CreateConsignmentForBusinessOrder
);
app.post(
  "/api/shipping/ship-gift-subscription",
  isUserInSuperuser,
  shippingController.CreateConsignmentForGiftSubscription
);

// Gift subscriptions (Integration with Woo)
app.get(
  "/api/giftsubscriptions",
  isUserInSuperuser,
  giftSubscriptionController.getGiftSubscriptions
);
app.post(
  "/api/giftsubscriptions/import",
  isUserInSuperuser,
  giftSubscriptionController.importGiftSubscriptions
);
app.put(
  "/api/giftsubscriptions/:id/first-delivery-date",
  isUserInSuperuser,
  giftSubscriptionController.setFirstDeliveryDate
);

// Customers
app.get("/api/customers", customerController.getCustomers);

// Products
app.get("/api/products", productController.getProducts);
app.get("/api/products/:id", productController.getProduct);
app.post("/api/products", isUserInSuperuser, productController.createProduct);
app.put(
  "/api/products/:id",
  isUserInSuperuser,
  productController.updateProduct
);

// Coffees
app.get("/api/coffees", coffeeController.getCoffees);
app.get("/api/coffees/:id", coffeeController.getCoffee);
app.post("/api/coffees", isUserInSuperuser, coffeeController.createCoffee);
app.put("/api/coffees/:id", isUserInSuperuser, coffeeController.updateCoffee);

// Orders
app.get("/api/orders", isUserInSuperuser, orderController.getOrders);
app.put("/api/orders/:id", isUserInSuperuser, orderController.updateOrder);
app.get("/api/orders/:id", isAuthenticated, orderController.getOrders);
app.post("/api/orders", isUserInSuperuser, orderController.createOrder);
app.post(
  "/api/orders/:id/complete",
  isUserInSuperuser,
  orderController.completeOrder
);
app.post(
  "/api/orders/:id/cancel",
  isUserInSuperuser,
  orderController.cancelOrder
);
app.post(
  "/api/orders/:id/process",
  isUserInSuperuser,
  orderController.processOrder
);
app.post(
  "/api/orders/:id/notes",
  isUserInSuperuser,
  orderController.addOrderNote
);
app.post(
  "/api/orders/:id/invoice",
  isUserInSuperuser,
  orderController.createInvoice
);

app.get("/api", function(_req: Request, res: Response) {
  res.send("Maridalen Brenneri Backoffice API");
});

/*** END API ***/

/*** CLIENT ***/

app.use(express.static(__dirname + "/../../client/dist/mb-shop"));

app.get("/", function(_req, res) {
  res.sendFile(__dirname + "/../../client/dist/mb-shop/index.html");
});

app.get("/*", function(_req, res) {
  res.redirect("/");
});

/*** END CLIENT ***/

// Error handling
app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(422).send({ validationError: err.message });
  }

  logger.error(err.message);
  return res.status(500).send({ error: err.message });
});

// console.log('NODE_ENV: ' + process.env.NODE_ENV);
//console.log('DATABASE_URL: ' + process.env.DATABASE_URL);

export default app;
