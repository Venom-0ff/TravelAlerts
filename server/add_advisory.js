import * as cfg from "./config.js";
import * as dbRtns from "./db_routines.js";
import { getJSONFromURLPromise } from "./utilities.js";

const addAdvisory = async () => {
    let logs = null;
    try {
        // connect to db
        const db = await dbRtns.getDBInstance();

        // clear the collection
        let results = await dbRtns.deleteAll(db, cfg.advCollection);
        logs = `Deleted ${results.deletedCount} existing documents from the ${cfg.advCollection} collection. `;

        // Load data
        let alertJSON = await getJSONFromURLPromise(cfg.gocAlertsURL);
        logs += "Retrieved Alert JSON from a remote site. ";
        let isoCountriesData = await getJSONFromURLPromise(cfg.isoCountriesURL);
        logs += "Retrieved Country JSON from GitHub. "

        let alerts = await isoCountriesData.map(c => {
            if (alertJSON.data[c["alpha-2"]])
                return ({
                    country: c["alpha-2"],
                    name: c.name,
                    text: alertJSON.data[c["alpha-2"]].eng["advisory-text"],
                    date: alertJSON.data[c["alpha-2"]]["date-published"].date,
                    region: c.region,
                    subregion: c["sub-region"]
                });
            else
                return ({
                    country: c["alpha-2"],
                    name: c.name,
                    text: "No travel alerts",
                    date: "",
                    region: c.region,
                    subregion: c["sub-region"]
                });
        });

        // Add the data to the db
        results = await dbRtns.addMany(db, cfg.advCollection, alerts);
        logs += `Added ${results.insertedCount} documents to the ${cfg.advCollection} collection.`
    }
    catch (err) {
        logs = err;
        console.log(err);
    }
    finally {
        return { results: logs };
    }
};

export { addAdvisory };