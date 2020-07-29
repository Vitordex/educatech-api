import { Model, Optional, Association } from "sequelize";
import { IAction, Action } from "../actions/action";
import { IUser, User } from "../users/user";

interface IUserActionCreationAttributes extends Optional<IUserAction, "id"> { }

export class UserAction extends Model<IDBUserAction, IUserActionCreationAttributes> implements IDBUserAction {
    public id!: number;

    public userId!: number;
    public user?: IUser;
    
    public actionId!: number;
    public action?: IAction;
    
    public resourceRange!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public static associations: {
        user: Association<UserAction, User>;
        action: Association<UserAction, Action>;
    }
}

export interface IUserAction {
    id: number;

    userId: number;
    user?: IUser;

    actionId: number;
    action?: IAction;
    
    resourceRange: string;
}

export interface IDBUserAction extends IUserAction {
    save(): Promise<IDBUserAction>

    created_at: Date;
    updated_at: Date;
}
