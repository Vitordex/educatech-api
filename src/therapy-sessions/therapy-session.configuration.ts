import { Sequelize, ModelAttributes, InitOptions, INTEGER, STRING } from "sequelize";
import { TherapySession } from "./therapy-session";

export class TherapySessionConfiguration {
    public static apply(connection: Sequelize): void {
        const fields: ModelAttributes = {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sessionSummary: {
                type: STRING
            },
            parentsRecommendation: {
                type: STRING
            }
        };
        const initOptions: InitOptions = {
            sequelize: connection,
            tableName: 'TherapySessions',
            freezeTableName: true,
            paranoid: true
        };
        TherapySession.init(fields, initOptions);
    }
}
