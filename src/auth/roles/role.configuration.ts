import { Sequelize, ModelAttributes, INTEGER, InitOptions, STRING } from "sequelize";
import { Role } from "./role";

export class RoleConfiguration {
    public static apply(connection: Sequelize): void {
        const fields: ModelAttributes = {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: STRING
            }
        };
        const initOptions: InitOptions = {
            sequelize: connection,
            tableName: 'Roles',
            freezeTableName: true,
            paranoid: true
        };
        Role.init(fields, initOptions);
    }
}