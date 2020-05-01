import { Response, Request } from "express";

import dashboardService from "../services/dashboard-service";
import { CargonizerService } from "../services/cargonizer-service";
import { getData } from "../services/stats";

class DashboardController {
  getData = async function (_req: Request, res: Response) {
    const data = await getData();

    const cargonizer = new CargonizerService();
    const cargonizerProfile = await cargonizer.fetchProfile();

    const stats = {
      ...data,
      cargonizerProfile,
    };

    res.send(stats);
  };

  getCurrentCoffees = async function (_req: Request, res: Response) {
    const coffees = await dashboardService.getCurrentCoffees();
    res.send(coffees);
  };

  getOrderStats = async function (_req: Request, res: Response) {
    const stats = await dashboardService.getOrderStats();
    res.send(stats);
  };

  getNextDeliveryDays = async function (_req: Request, res: Response) {
    const days = await dashboardService.getDeliveryDays(3);
    res.send(days);
  };

  getSubscriptionCoffeeTypeCounter = async function (
    _req: Request,
    res: Response
  ) {
    const counter = await dashboardService.getSubscriptionCoffeeTypesCount();
    res.send(counter);
  };
}

export default new DashboardController();
