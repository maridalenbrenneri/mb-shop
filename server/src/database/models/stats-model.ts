import { Sequelize, Model, DATE, TEXT } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

const STATS_ID = 1;

export default class StatsModel extends Model {
  public static getStats = async function() {
    return await StatsModel.findByPk(STATS_ID);
  };

  public static updateStats = function(statsData: any) {
    return StatsModel.create({
      lastUpdated: new Date(),
      data: JSON.stringify(statsData)
    });
    // return StatsModel.findByPk(STATS_ID).then((dbStats: any) => {
    //   return dbStats.update({
    //     lastUpdated: new Date(),
    //     data: JSON.stringify(statsData)
    //   });
    // });
  };
}
StatsModel.init(
  {
    lastUpdated: { type: DATE, allowNull: false },
    data: { type: TEXT, allowNull: false }
  },
  {
    sequelize,
    modelName: "stats"
  }
);
