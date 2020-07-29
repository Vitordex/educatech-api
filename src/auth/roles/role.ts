import { IUser, User } from "../users/user";
import { Optional, Model, HasManyCreateAssociationMixin, HasManyCountAssociationsMixin, HasManyHasAssociationMixin, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, Association, HasManySetAssociationsMixin } from "sequelize";

interface IRoleCreationAttributes extends Optional<IRole, "id"> { }

export class Role extends Model<IRole, IRoleCreationAttributes> implements IDBRole {
    public id!: number;
    public name!: string;

    public users?: IUser[];

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    public getUsers!: HasManyGetAssociationsMixin<IUser>;
    public addUser!: HasManyAddAssociationMixin<IUser, number>;
    public hasUser!: HasManyHasAssociationMixin<IUser, number>;
    public countUsers!: HasManyCountAssociationsMixin;
    public createUser!: HasManyCreateAssociationMixin<IUser>;
    public setUsers!: HasManySetAssociationsMixin<IUser, number>;

    public static associations: {
        users: Association<Role, User>;
    };
}

export interface IRole {
    id: number;
    name: string;

    users?: IUser[];

    created_at: Date;
    updated_at: Date;
}

export interface IDBRole extends IRole {
    save(): Promise<IDBRole>;

    getUsers: HasManyGetAssociationsMixin<IUser>;
    addUser: HasManyAddAssociationMixin<IUser, number>;
    hasUser: HasManyHasAssociationMixin<IUser, number>;
    countUsers: HasManyCountAssociationsMixin;
    createUser: HasManyCreateAssociationMixin<IUser>;
    setUsers: HasManySetAssociationsMixin<IUser, number>;
}