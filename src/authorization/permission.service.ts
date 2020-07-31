import { IAction } from "../auth/actions/action";
import { IUserAction } from "../auth/user-actions/user-action";

import { IActionService } from "../services/iaction.service";
import { IUserActionService } from "../services/iuser-action.service";

import { ApiFunctions } from "../api_utilities/api-functions";
import { API_STATUS } from "../api_utilities/api-status";
import { IOperation } from "./IOperation";
import { IPermissionService } from "./ipermission.service";

export class PermissionService implements IPermissionService {
    constructor(
        private userActionService: IUserActionService,
        private actionService: IActionService) { }

    public async addPermissions(userId: number, resourceId: number, operations: IOperation[]) {
        let actions: IAction[] = [];

        try {
            const serviceOperations = operations.reduce((services, operation) => {
                if (!services[operation.serviceName]) services[operation.serviceName] = [];
                services[operation.serviceName].push(operation.methodName);

                return services;
            }, {});
            const keys = Object.keys(serviceOperations);
            const actionOperations = keys.map((key) => {
                const methodNames = serviceOperations[key];
                return this.actionService.findWithMethodNames(methodNames, key);
            });
            const result = await Promise.all(actionOperations);
            actions = result.reduce((array, operation) => array.concat(operation), []);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding actions', error);
        }

        try {
            const userActions: IUserAction[] = actions.map((action) => ({
                id: undefined as any,
                userId: userId,
                resourceRange: resourceId === 0 ? '*' : resourceId.toString(),
                actionId: action.id
            }));
            await this.userActionService.addUserActions(userActions);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error adding user permissions');
        }
    }

    public async removeAllPermissions(userId: number) {
        try {
            await this.userActionService.removeAllByUserId(userId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error erasing user permissions');
        }
    }
}