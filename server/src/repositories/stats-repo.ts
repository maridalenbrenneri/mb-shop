import BaseRepo from './base-repo';
import { statsModel } from './models';
import moment = require('moment');

class StatsRepo extends BaseRepo {

    statsId = 1;

    private Stats = this.sequelize.define('stats', statsModel);

    createTable = function (forceCreate = false) {
        return this.Stats.sync({ force: forceCreate });
    }

    getStats = function () {
        return this.Stats.findById(this.statsId);
    }

    updateStats = function (statsData) {
        return this.Stats.findById(this.statsId).then(dbStats => {

            return dbStats.update(
                {
                    lastUpdated: new Date(),
                    data: JSON.stringify(statsData)
                });
        });
    }
}

export default new StatsRepo();