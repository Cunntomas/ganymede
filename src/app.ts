import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
const cors = require('@koa/cors');
import mongoose from 'mongoose';
import * as routes from './routes/index';
const MONGODB_HOST = process.env.MONGODB_HOST;
const MONGODB_PORT = process.env.MONGODB_PORT;
const MONGODB_DB = process.env.MONGODB_DB;

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
        return mongoose.connect(
          `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`,
          {useNewUrlParser: true});
    }
}

export default new App().app;
