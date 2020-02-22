import { Response, Request } from "express";
import coffeeService from "../services/coffee-service";

class CoffeeController {
  /**
   * GET /coffees/:id
   */
  getCoffee = function(req: Request, res: Response) {
    return coffeeService.getCoffee(req.body.id, res);
  };

  /**
   * GET /coffees
   */
  getCoffees = async function(_req: Request, res: Response) {
    const coffees = await coffeeService.getCoffees();
    res.send(coffees);
  };

  /**
   * POST /coffees
   */
  createCoffee = function(req: Request, res: Response) {
    return coffeeService.createCoffee(req.body, res);
  };

  /**
   * PUT /coffees/:id
   */
  updateCoffee = function(req: Request, res: Response) {
    return coffeeService.updateCoffee(req.body, res);
  };
}

export default new CoffeeController();
