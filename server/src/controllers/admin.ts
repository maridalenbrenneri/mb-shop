import { Response, Request } from "express";
import logger from "../utils/logger";
import ProductRepo from "../repositories/product-repo";
import UserRepo from "../repositories/user-repo";
import OrderRepo from "../repositories/order-repo";
import customerRepo from "../repositories/customer-repo";
import product from "./product";
import giftSubscriptionRepo from "../repositories/gift-subscription-repo";
import dashboardService from "../services/dashboard-service";
import statsRepo from "../repositories/stats-repo";

class AdminController {
  // WARNING: Overrides any existing tables

  createTable = function(req: Request, res: Response) {
    Promise.all([
      // UserRepo.createTable(false),
      // customerRepo.createTable(false),
      // ProductRepo.createTable(false),
      // OrderRepo.createTable(false),
      // giftSubscriptionRepo.createTable(false)
      // statsRepo.createTable(false)
    ])
      .then(() => {
        logger.info("Tables created");
        res.send("Tables created");
      })
      .catch(function(err) {
        logger.error(err);
        res
          .status(500)
          .send({
            error: "An error occured when creating the tables. Error: " + err
          });
      });
  };

  hello = function(req: Request, res: Response) {
    res.send("Hello MB API!");
  };

  testDb = function(req: Request, res: Response) {
    UserRepo.getUser(1)
      .then(user => {
        user.password = "";
        return res.send(user);
      })
      .catch(function(err) {
        logger.error(err);
        res
          .status(500)
          .send({ error: "An error occured when getting data. Error: " + err });
      });
  };

  getStats = async function(_req: Request, res: Response) {
    const stats = await dashboardService.getStats();
    res.send(stats);
  };

  importStats = async function(_req: Request, res: Response) {
    const stats = await dashboardService.importStats();
    res.send(stats);
  };
}

export default new AdminController();
