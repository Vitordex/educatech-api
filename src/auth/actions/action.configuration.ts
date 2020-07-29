import { Sequelize, InitOptions, ModelAttributes, INTEGER, STRING } from "sequelize";
import { Action } from "./action";

export class ActionConfiguration {
    public static apply(connection: Sequelize) {
        const fields: ModelAttributes = {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            serviceName: {
                type: STRING
            },
            methodName: {
                type: STRING
            }
        };
        const initOptions: InitOptions = { 
            sequelize: connection,
            tableName: 'Actions', 
            freezeTableName: true,
            paranoid: true
        };
        Action.init(fields, initOptions);
    }
}