import { IRoleActionService } from "../../services/irole-action.service";
import { DatabaseContext } from "../../database/database-context";
import { RoleAction, IRoleAction } from "./role-action";
import { Association } from "sequelize/types";
import { Action } from "../actions/action";

export class DBRoleActionService implements IRoleActionService {
    private Model: typeof RoleAction;
    private actionAssociation: Association<RoleAction, Action>;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.RoleAction;
        this.actionAssociation = this.Model.associations.action;
    }

    public findRoleActionsByRoleIdIncludeAction(roleId: number, serviceName?: string, methodName?: string): Promise<IRoleAction[]> {
        return this.Model.findAll({
            where: { roleId },
            include: [{association: this.actionAssociation, where: {serviceName, methodName}}]
        });
    }


    public findRoleActionsByRoleId(roleId: number): Promise<IRoleAction[]> {
        return this.Model.findAll({ where: { roleId } });
    }
}
