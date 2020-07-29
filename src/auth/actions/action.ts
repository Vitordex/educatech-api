import { Optional, Model, Association } from "sequelize";
import { Role } from "../roles/role";

interface IActionCreationAttributes extends Optional<IAction, "id"> {}

export class Action extends Model<IAction, IActionCreationAttributes> implements IAction {
    public id!: number;
    public serviceName!: string;
    public methodName!: string;
    
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public static associations: {
        roles: Association<Action, Role>
    }
}

export interface IDBAction extends IAction {
    save(): Promise<IDBAction>;
}

export interface IAction {
    id: number;
    serviceName: string;
    methodName: string;

    created_at: Date;
    updated_at: Date;
}