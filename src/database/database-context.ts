import { UserConfiguration } from "../auth/users/user.configuration";
import { User } from "../auth/users/user";
import { Action } from "../auth/actions/action";
import { Role } from "../auth/roles/role";
import { UserAction } from "../auth/user-actions/user-action";
import { RoleAction } from "../auth/role-actions/role-action";
import { RoleConfiguration } from "../auth/roles/role.configuration";
import { ActionConfiguration } from "../auth/actions/action.configuration";
import { IDatabaseService } from "./database.service";
import { RoleActionConfiguration } from "../auth/role-actions/role-action.configuration";
import { UserActionConfiguration } from "../auth/user-actions/user-action.configuration";

export class DatabaseContext {
    public get User() { return User; }
    public get Action() { return Action; }
    public get Role() { return Role; }
    public get UserAction() { return UserAction; }
    public get RoleAction() { return RoleAction; }

    public configure(database: IDatabaseService): void {
        const connection = database.connection;
        ActionConfiguration.apply(connection);
        RoleConfiguration.apply(connection);
        UserConfiguration.apply(connection);
        RoleActionConfiguration.apply(connection);
        UserActionConfiguration.apply(connection);

        Role.hasMany(User, { as: "users", foreignKey: "roleId" });
        User.belongsTo(Role, { as: "role", foreignKey: "roleId" });

        Action.belongsToMany(User, { through: typeof UserAction, as: 'users', foreignKey: 'actionId' });
        User.belongsToMany(Action, { through: typeof UserAction, as: 'actions', foreignKey: 'userId' });

        Action.belongsToMany(Role, { as: 'roles', through: typeof RoleAction, foreignKey: 'roleId' });
        Role.belongsToMany(Action, { as: 'actions', through: typeof RoleAction, foreignKey: 'actionId' });

        RoleAction.belongsTo(Action, { as: 'action', foreignKey: 'actionId' });
        RoleAction.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });

        UserAction.belongsTo(Action, { as: 'action', foreignKey: 'actionId' });
        UserAction.belongsTo(User, { as: 'user', foreignKey: 'userId' });
    }
}
