import { Response } from "express";
import CoffeeModel from "../database/models/coffee-model";
import logger from "../utils/logger";
// import { CoffeeValidator } from "../validators/coffee-validator";

class CoffeeService {
  getCoffee = async function (coffeeId: number) {
    let self = this;

    return await CoffeeModel.getCoffee(coffeeId).then((coffee) => {
      if (!coffee) return null;
      return self.mapToClientModel(coffee);
    });
  };

  getCoffees = async function (includeInactive: boolean = false) {
    let self = this;
    let filter = !includeInactive ? { isActive: true } : null;

    const coffees = await CoffeeModel.getCoffees(filter);
    return coffees.map((p) => self.mapToClientModel(p));
  };

  createCoffee = function (coffee: any, res: Response) {
    let self = this;

    // CoffeeValidator.validate(coffee);

    let dbCoffee = self.mapToDbModel(coffee);

    return CoffeeModel.createCoffee(dbCoffee)
      .then((createdCoffee) => {
        return res.send(self.mapToClientModel(createdCoffee));
      })
      .catch(function (err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when creating the coffee: " + err,
        });
      });
  };

  updateCoffee = function (coffee: any, res: Response) {
    let self = this;

    // CoffeeValidator.validate(coffee);

    let dbCoffee = self.mapToDbModel(coffee);

    return CoffeeModel.updateCoffee(dbCoffee.id, dbCoffee)
      .then((updatedCoffee) => {
        return res.send(self.mapToClientModel(updatedCoffee));
      })
      .catch(function (err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when updating the coffee: " + err,
        });
      });
  };

  mapToDbModel = function (coffee) {
    return {
      id: coffee.id,
      code: coffee.code,
      name: coffee.name,
      country: coffee.country,
      isActive: coffee.isActive,
      isInStock: coffee.isInStock,
    };
  };

  mapToClientModel = function (coffee) {
    return {
      id: coffee.id,
      code: coffee.code,
      name: coffee.name,
      country: coffee.country,
      isActive: coffee.isActive,
      isInStock: coffee.isInStock,
    };
  };
}

export default new CoffeeService();
