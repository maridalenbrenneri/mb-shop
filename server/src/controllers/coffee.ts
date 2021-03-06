import { Response, Request } from "express";
import coffeeService from "../services/coffee-service";

class CoffeeController {
  /**
   * GET /coffees/:id
   */
  getCoffee = async function (req: Request, res: Response) {
    const coffee = await coffeeService.getCoffee(req.body.id);
    return res.send(coffee);
  };

  /**
   * GET /coffees
   */
  getCoffees = async function (req: Request, res: Response) {
    const includeInactive = req.query.includeInactive === "true";
    const coffees = await coffeeService.getCoffees(includeInactive);
    res.send(coffees);
  };

  /**
   * POST /coffees
   */
  createCoffee = function (req: Request, res: Response) {
    return coffeeService.createCoffee(req.body, res);
  };

  /**
   * PUT /coffees/:id
   */
  updateCoffee = function (req: Request, res: Response) {
    return coffeeService.updateCoffee(req.body, res);
  };
}

export default new CoffeeController();
