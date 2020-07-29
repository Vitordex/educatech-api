import Router from "koa-router";
import { Middleware } from "koa";
import BaseController from "./base.controller";
import { IOperation } from "../authorization/IOperation";

export default abstract class BaseApi {
    protected router: Router;
    protected abstract controller: BaseController;
    constructor(prefix: string, protected serviceName: string) {
        this.router = new Router({
            prefix: `/api/${prefix}`
        });
    }

    protected getOperation(methodName: string): IOperation {
        return { serviceName: this.serviceName, methodName: methodName };
    }

    protected executionMiddleware(action: Function): Middleware {
        return async (context, next) => {
            try {
                context.body = await action(context.input);
            } catch (error) {
                throw error;
            }

            if (context.status !== 201) context.status = 200;
            if (!context.body) context.body = '';

            return next();
        }
    }

    public get routes() {
        return this.router.routes();
    }

    public get allowedMethods() {
        return this.router.allowedMethods();
    }

    public abstract configureRoutes();
}
