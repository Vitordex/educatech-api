import {
  Optional,
  Model,
  HasOneSetAssociationMixin,
  Association
} from "sequelize";

import { IUser } from "../auth/users/user";
import { User } from "../auth/users/user";
import { IPatient, Patient } from "../patients/patient";

interface ITherapySessionCreationAttributes extends Optional<ITherapySession, "id"> { }

export class TherapySession extends Model<IDBTherapySession, ITherapySessionCreationAttributes>
  implements IDBTherapySession {
  public id!: number;

  public sessionSummary!: string;
  public parentsRecommendation!: string;

  public user?: IUser;
  public userId!: number;

  public patient?: IPatient | undefined;
  public patientId!: number;

  public setUser!: HasOneSetAssociationMixin<IUser, number>;
  public setPatient!: HasOneSetAssociationMixin<IPatient, number>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<TherapySession, User>;
    patient: Association<TherapySession, Patient>;
  }
}

export interface ITherapySession {
  id: number;

  sessionSummary: string;
  parentsRecommendation: string;

  user?: IUser;
  userId: number;

  patient?: IPatient;
  patientId: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IDBTherapySession extends ITherapySession {
  save(): Promise<IDBTherapySession>;

  setUser: HasOneSetAssociationMixin<IUser, number>;
  setPatient: HasOneSetAssociationMixin<IPatient, number>;
}