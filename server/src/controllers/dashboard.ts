import { Response, Request } from "express";
import logger from "../utils/logger";
import aboaboStatsService from "../services/aboabo-stats-service";
import dashboardService from "../services/dashboard-service";

class DashboardController {
  getAboaboStats = async function(_req: Request, res: Response) {
    const stats = await aboaboStatsService.getStats();
    res.send(stats);
  };

  importAboaboStats = async function(_req: Request, res: Response) {
    try {
      const stats = await aboaboStatsService.importStats();
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

  getOrderStats = async function(_req: Request, res: Response) {
    const stats = await dashboardService.getOrderStats();
    res.send(stats);
  };

  getNextDeliveryDays = async function(_req: Request, res: Response) {
    const days = await dashboardService.getNextDeliveryDays(3);
    res.send(days);
  };

  calculateDeliveryQuantities = async function(req: Request, res: Response) {
    const quantities = dashboardService.calculateDeliveryQuantities(req.body);
    res.send(quantities);
  };
}

export default new DashboardController();
