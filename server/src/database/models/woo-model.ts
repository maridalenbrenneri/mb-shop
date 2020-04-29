import { Sequelize, Model, DATE, TEXT } from "sequelize";

interface IWooData {
  coffeesInActiveOrders: any;
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {},
});

const WOO_ID = 1;

export default class WooModel extends Model {
  public static getWooData = async function () {
    return await WooModel.findByPk(WOO_ID);
  };

  public static updateWooData = async function (wooData: IWooData) {
    const data = await WooModel.findByPk(WOO_ID);
    return await data.update({
      importedAt: new Date(),
      coffeesInActiveOrders: JSON.stringify(wooData.coffeesInActiveOrders),
    });
  };
}

WooModel.init(
  {
    importedAt: { type: DATE, allowNull: false },
    coffeesInActiveOrders: { type: TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "woo",
  }
);
