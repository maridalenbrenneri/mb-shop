import { Response, Request } from "express";
import logger from "../utils/logger";
import aboaboStatsService from "../services/aboabo-stats-service";

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
}

export default new DashboardController();
