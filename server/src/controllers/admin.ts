import { Response, Request } from "express";
import logger from "../utils/logger";
import UserModel from "../database/models/user-model";
import dashboardService from "../services/dashboard-service";

class AdminController {
  hello = function(req: Request, res: Response) {
    res.send("Hello MB API!");
  };

  testDb = function(_req: Request, res: Response) {
    UserModel.getUser(1)
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
    try {
      const stats = await dashboardService.importStats();
      res.send(stats);
    } catch (err) {
      logger.error(err);
      res.status(500).send({
        error:
          "An error occured when importing data. Error: " +
          err +
          " - " +
          err.msg
      });
    }
  };
}

export default new AdminController();
