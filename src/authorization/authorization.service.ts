import { IAuthorizationService } from "./iauthorization.service";
import { IRoleActionService } from "../services/irole-action.service";
import { IUserActionService } from "../services/iuser-action.service";
import { IOperation } from "./IOperation";
import { IUser } from "../auth/users/user";
import { IUserAction } from "../auth/user-actions/user-action";
import { IActionService } from "../services/iaction.service";

export class AuthorizationService implements IAuthorizationService {
    constructor(
        private roleActionService: IRoleActionService,
        private userActionService: IUserActionService,
        private actionService: IActionService) { }

    public async authorize(user: IUser, resourceId: number, operationIdentifier: IOperation) {
        const { roleId } = user;
        const { methodName, serviceName } = operationIdentifier;

        const roleActions = await this.roleActionService.findRoleActionsByRoleIdIncludeAction(
            roleId,
            serviceName,
            methodName);
        const userActions = await this.userActionService.findUserActionByUserIdIncludeAction(
            user.id,
            serviceName,
            methodName);

        let authorized = false;
        userActions.forEach(userAction => {
            const { resourceRange } = userAction;
            authorized = resourceRange === '*' || resourceRange.includes(resourceId.toString());
        });

        if (authorized) return authorized;

        roleActions.forEach(roleAction => {
            const { resourceRange } = roleAction;
            authorized = resourceRange === '*' || resourceRange.includes(resourceId.toString());
        });

        return authorized;
    }

    public async addPermissions(userId: number, serviceName: string, methodNames: string[]) {
        const actions = await this.actionService.findWithMethodNames(methodNames, serviceName);

        const userActions: IUserAction[] = actions.map((action) => ({
            id: undefined as any,
            userId: userId,
            resourceRange: userId.toString(),
            actionId: action.id
        }));
        await this.userActionService.addUserActions(userActions);
    }

    public removePermissions(userId: number) {
        return this.userActionService.removeAllByUserId(userId);
    }
}
