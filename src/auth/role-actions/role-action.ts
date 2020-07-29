import { Model, Optional, Association } from "sequelize";
import { Action, IAction } from "../actions/action";
import { Role, IRole } from "../roles/role";

interface IRoleActionCreationAttributes extends Optional<IRoleAction, "id"> { }

export class RoleAction extends Model<IRoleAction, IRoleActionCreationAttributes> implements IRoleAction {
    public id!: number;

    public roleId!: number;
    public role?: IRole;

    public actionId!: number;
    public action?: IAction;
    
    public resourceRange!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public static associations: {
        action: Association<RoleAction, Action>,
        role: Association<RoleAction, Role>
    }
}

export interface IRoleAction {
    id?: number;
    
    roleId: number;
    role?: IRole;

    actionId: number;
    action?: IAction;

    resourceRange: string;

    created_at: Date;
    updated_at: Date;
}
