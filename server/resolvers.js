import * as dbRtns from "./db_routines.js";
import * as cfg from "./config.js";
import { loadData } from "./project1_setup.js";

const resolvers = {
    project1_setup: async () => {
        return await loadData();
    },
    alerts: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.collection);
    },
    alertsforregion: async (args) => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.collection, {region: args.variable});
    },
    alertsforsubregion: async (args) => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.collection, {subregion: args.variable});
    },
    advisoriesfortraveler: async (args) => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.advCollection, {name: args.variable});
    },
    regions: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, cfg.collection, "region");
    },
    subregions: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, cfg.collection, "subregion");
    },
    travelers: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, cfg.advCollection, "name");
    },
    addadvisory: async (args) => {
        let db = await dbRtns.getDBInstance();
        let advisory = { name: args.name, country: args.country, text: args.text, date: args.date };
        await dbRtns.addOne(db, cfg.advCollection, advisory);
        return advisory;
    }
};

export { resolvers };