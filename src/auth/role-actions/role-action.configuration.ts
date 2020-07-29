import { Sequelize, ModelAttributes, INTEGER, STRING, InitOptions } from "sequelize";
import { RoleAction } from "./role-action";

export class RoleActionConfiguration {
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
            roleId: {
                type: INTEGER
            },
            resourceRange: {
                type: STRING
            }
        };
        const initOptions: InitOptions = {
            sequelize: connection,
            tableName: 'RoleActions',
            freezeTableName: true,
            paranoid: true
        };
        RoleAction.init(fields, initOptions);
    }
}