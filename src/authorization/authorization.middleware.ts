import { Middleware, Context } from "koa";
import { AuthorizationService } from "./authorization.service";
import { IOperation } from "./IOperation";
import { DBRoleActionService } from "../auth/role-actions/db-role-action.service";
import { DatabaseContext } from "../database/database-context";
import { DBUserActionService } from "../auth/user-actions/db-user-action.service";
import { DBUserService } from "../auth/users/db-user.service";
import { InputObject } from "../input-validation/input-validation.middleware";
import { IDBUser } from "../auth/users/user";
import { ApiFunctions } from "../api_utilities/api-functions";
import { DBActionService } from "../auth/actions/db-action.service";
import { API_STATUS } from "../api_utilities/api-status";

export class AuthorizationMiddleware {
    private authorizationService: AuthorizationService;
    private userService: DBUserService;

    constructor(dbContext: DatabaseContext) {
        const roleActionService = new DBRoleActionService(dbContext);
        const userActionService = new DBUserActionService(dbContext);
        this.userService = new DBUserService(dbContext);
        const actionService = new DBActionService(dbContext);

        this.authorizationService = new AuthorizationService(
            roleActionService,
            userActionService,
            actionService);
    }

    private getResourceId(path: string, input: InputObject): number {
        const properties = path.split('.');
        let currentObject = input;
        properties.forEach(property => {
            currentObject = currentObject[property];
        });

        return currentObject as number;
    }

    public authorize(pathToResourceId: string, operationIdentifier: IOperation): Middleware {
        return async (context: Context, next) => {
            if (!context.input) ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 
                'Make sure there is an input object before calling the middleware');
            const resourceId = this.getResourceId(pathToResourceId, context.input!);

            if (!context.state) ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 
                'Make sure there is a state object before calling the middleware');
            const userId = context.state.user.id;

            let user: IDBUser | null = null;
            try {
                user = await this.userService.findByIdIncludeRole(userId);
            } catch (error) {
                const message = 'There was an error finding the user';
                ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, message, error);
            }

            if (!user) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'User not found');

            let authorized = false;
            try {
                authorized = await this.authorizationService.authorize(user!, resourceId, operationIdentifier!);
            } catch (error) {
                const message = 'There was an error authorizing the request';
                ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, message, error);
            }

            if (!authorized) ApiFunctions.throwError(API_STATUS.FORBIDDEN, 'Request Unauthorized');

            return next();
        };
    }

    public addPermissionsToUser(pathToUserId: string, serviceName: string, methodNames: string[]): Middleware {
        return async (context, next) => {
            const userId = this.getResourceId(pathToUserId, context);

            try {
                await this.authorizationService.addPermissions(userId, serviceName, methodNames);
            } catch (error) {
                ApiFunctions.throwError(
                    API_STATUS.INTERNAL_ERROR, 
                    `There was an error adding permissions to user ${userId}`);
            }

            return next();
        };
    }

    public removeUserPermissions(pathToUserId: string): Middleware {
        return async (context, next) => {
            const userId = this.getResourceId(pathToUserId, context);

            try {
                await this.authorizationService.removePermissions(userId);
            } catch (error) {
                ApiFunctions.throwError(
                    API_STATUS.INTERNAL_ERROR, 
                    `There was an error removing permissions from user ${userId}`);
            }

            return next();
        };
    }
}
