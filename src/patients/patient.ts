import {
  Optional,
  Model,
  HasOneSetAssociationMixin,
  Association
} from "sequelize";

import { IUser } from "../auth/users/user";
import { User } from "../auth/users/user";

interface IPatientCreationAttributes extends Optional<IPatient, "id"> { }

export class Patient extends Model<IDBPatient, IPatientCreationAttributes>
  implements IDBPatient {
  public id!: number;

  public name!: string;

  public isActive!: boolean;
  public isRegularSchool!: boolean;
  public schoolName?: string | undefined;

  public birthDay!: Date;

  public user?: IUser;
  public userId!: number;

  public setUser!: HasOneSetAssociationMixin<IUser, number>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<Patient, User>;
  }
}

export interface IPatient {
  id: number;
  name: string;
  birthDay: Date;

  isActive: boolean;

  isRegularSchool: boolean;
  schoolName?: string;

  user?: IUser;
  userId: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IDBPatient extends IPatient {
  save(): Promise<IDBPatient>;

  setUser: HasOneSetAssociationMixin<IUser, number>;
}