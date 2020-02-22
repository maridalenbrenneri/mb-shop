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

  getCurrentCoffees = async function(_req: Request, res: Response) {
    const coffees = await dashboardService.getCurrentCoffees();
    res.send(coffees);
  };

  getOrderStats = async function(_req: Request, res: Response) {
    const stats = await dashboardService.getOrderStats();
    res.send(stats);
  };

  getNextDeliveryDays = async function(_req: Request, res: Response) {
    const days = await dashboardService.getDeliveryDays(3);
    res.send(days);
  };
}

export default new DashboardController();
