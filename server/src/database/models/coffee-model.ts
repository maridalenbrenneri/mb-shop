import { Sequelize, Model, STRING, BOOLEAN } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class CoffeeModel extends Model {
  public static getCoffee = function(coffeeId: Number) {
    return CoffeeModel.findByPk(coffeeId as any);
  };

  public static getCoffees = function(filter) {
    filter = filter || {};
    filter.isDeleted = false;

    return CoffeeModel.findAll({ where: filter });
  };

  public static createCoffee = function(coffee) {
    return CoffeeModel.create(coffee);
  };

  public static updateCoffee = function(coffeeId, coffee) {
    return CoffeeModel.findByPk(coffeeId).then(dbCoffee => {
      return dbCoffee.update(coffee);
    });
  };
}

CoffeeModel.init(
  {
    code: { type: STRING, allowNull: false },
    name: { type: STRING, allowNull: false },
    country: { type: STRING, allowNull: false },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isInStock: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "coffee"
  }
);
