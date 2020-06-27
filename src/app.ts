import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import * as routes from './routes/index';

class App {
    public app: Koa;
    public router: Router;
    private MONGODB_HOST = process.env.MONGODB_HOST;
    private MONGODB_PORT = process.env.MONGODB_PORT;
    private MONGODB_DB = process.env.MONGODB_DB;

    constructor() {
        this.setConfig();
        this.setMongoConfig();
    }

    private setConfig() {
        this.app = new Koa();
        this.router = new Router();
        this.app.use( logger() );
        this.app.use( bodyParser() );

        Object.keys(routes).forEach((key) => {
            this.router.use(`/api/${key}`, routes[key].routes());
        });
        
        this.app.use(this.router.routes());
    }

    private setMongoConfig() {
        return mongoose.connect(
          `mongodb://${this.MONGODB_HOST}:${this.MONGODB_PORT}/${this.MONGODB_DB}`,
          {useNewUrlParser: true});
    }
}

export default new App().app;
