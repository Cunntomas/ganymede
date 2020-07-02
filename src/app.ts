import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
const cors = require('@koa/cors');
import mongoose from 'mongoose';
import * as routes from './routes/index';
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB;

class App {
    public app: Koa;
    public router: Router;


    constructor() {
        this.setConfig();
        this.setMongoConfig();
    }

    private setConfig() {
        this.app = new Koa();
        this.router = new Router();
        this.app.use( logger() );
        this.app.use( bodyParser() );
        this.app.use(cors());

        Object.keys(routes).forEach((key) => {
            this.router.use(`/api/${key}`, routes[key].routes());
        });

        this.app.use(this.router.routes());
    }

    private setMongoConfig() {
        return mongoose.connect(MONGO_URI, {dbName: MONGO_DB, useNewUrlParser: true});
    }
}

export default new App().app;
