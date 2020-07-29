import { IRole, Role } from "../roles/role";
import { Optional, Model, HasOneCreateAssociationMixin, HasOneSetAssociationMixin, Association } from "sequelize";
import { IUserAction } from "../user-actions/user-action";
import { EGender } from "./egender";

interface IUserCreationAttributes extends Optional<IUser, "id"> { }

export class User extends Model<IDBUser, IUserCreationAttributes>
  implements IDBUser {
  public id!: number;

  public name!: string;
  
  public email!: string;
  public password!: string;

  public gender!: EGender;
  public birthDay!: Date;
  
  public userActions?: IUserAction[];
  public role?: IRole;
  public roleId!: number;

  public setRole!: HasOneSetAssociationMixin<IRole, number>;
  public createRole!: HasOneCreateAssociationMixin<IRole>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    role: Association<User, Role>;
  }
}

export interface IUser {
    id: number,
    email: string,
    password: string,
    name: string,
    gender: EGender,
    birthDay: Date;

    userActions?: IUserAction[];
    role?: IRole;
    roleId: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface IDBUser extends IUser {
  save(): Promise<IDBUser>;

  setRole: HasOneSetAssociationMixin<IRole, number>;
  createRole: HasOneCreateAssociationMixin<IRole>;
}