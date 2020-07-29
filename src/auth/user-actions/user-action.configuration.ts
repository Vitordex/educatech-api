import { Sequelize, ModelAttributes, INTEGER, STRING, InitOptions } from "sequelize";
import { UserAction } from "./user-action";

export class UserActionConfiguration {
    public static apply(connection: Sequelize): void {
        const fields: ModelAttributes = {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            actionId: {
                type: INTEGER
            },
            userId: {
                type: INTEGER
            },
            resourceRange: {
                type: STRING
            }
        };
        const initOptions: InitOptions = {
            sequelize: connection,
            tableName: 'UserActions',
            freezeTableName: true,
            paranoid: true
        };
        UserAction.init(fields, initOptions);
    }
}