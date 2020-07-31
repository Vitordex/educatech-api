import { Sequelize, ModelAttributes, InitOptions, INTEGER, STRING } from "sequelize";
import { Patient } from "./patient";
import { DATE } from "sequelize";
import { BOOLEAN } from "sequelize";

export class PatientConfiguration {
    public static apply(connection: Sequelize): void {
        const fields: ModelAttributes = {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: STRING
            },
            birthDay: {
                type: DATE
            },
            isActive: {
                type: BOOLEAN
            },
            isRegularSchool: {
                type: BOOLEAN
            },
            schoolName: {
                type: STRING
            }
        };
        const initOptions: InitOptions = {
            sequelize: connection,
            tableName: 'Patients',
            freezeTableName: true,
            paranoid: true
        };
        Patient.init(fields, initOptions);
    }
}
