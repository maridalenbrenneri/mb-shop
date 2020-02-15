import { Response } from "express";
import CoffeeModel from "../database/models/coffee-model";
import logger from "../utils/logger";
// import { CoffeeValidator } from "../validators/coffee-validator";

class CoffeeService {
  getCoffee = function(coffeeId: number, res: Response) {
    let self = this;

    return CoffeeModel.getCoffee(coffeeId)
      .then(coffee => {
        if (!coffee) {
          return res.status(404).send();
        }

        return res.send(self.mapToClientModel(coffee));
      })
      .catch(function(err) {
        logger.error(err);
        return res
          .status(500)
          .send({ error: "An error occured when getting the coffee" });
      });
  };

  getCoffees = function(res: Response) {
    let self = this;
    let filter = {};

    return CoffeeModel.getCoffees(filter)
      .then(coffees => {
        let clientCoffees = coffees.map(p => self.mapToClientModel(p));
        return res.send(clientCoffees);
      })
      .catch(function(err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when getting the coffees: " + err
        });
      });
  };

  createCoffee = function(coffee: any, res: Response) {
    let self = this;

    // CoffeeValidator.validate(coffee);

    let dbCoffee = self.mapToDbModel(coffee);

    return CoffeeModel.createCoffee(dbCoffee)
      .then(createdCoffee => {
        return res.send(self.mapToClientModel(createdCoffee));
      })
      .catch(function(err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when creating the coffee: " + err
        });
      });
  };

  updateCoffee = function(coffee: any, res: Response) {
    let self = this;

    // CoffeeValidator.validate(coffee);

    let dbCoffee = self.mapToDbModel(coffee);

    return CoffeeModel.updateCoffee(dbCoffee.id, dbCoffee)
      .then(updatedCoffee => {
        return res.send(self.mapToClientModel(updatedCoffee));
      })
      .catch(function(err) {
        logger.error(err);
        return res.status(500).send({
          error: "An error occured when updating the coffee: " + err
        });
      });
  };

  mapToDbModel = function(coffee) {
    return {
      id: coffee.id,
      code: coffee.code,
      name: coffee.name,
      country: coffee.country,
      isActive: coffee.isActive,
      isInStock: coffee.isInStock
    };
  };

  mapToClientModel = function(coffee) {
    return {
      id: coffee.id,
      code: coffee.code,
      name: coffee.name,
      country: coffee.country,
      isActive: coffee.isActive,
      isInStock: coffee.isInStock
    };
  };
}

export default new CoffeeService();
