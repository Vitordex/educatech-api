import { Sequelize, ModelAttributes, InitOptions, INTEGER, STRING } from "sequelize";
import { User } from "./user";

export class UserConfiguration {
    public static apply(connection: Sequelize): void {
        const fields: ModelAttributes = {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: STRING
            },
            password: {
                type: STRING
            },
            name: {
                type: STRING
            }
        };
        const initOptions: InitOptions = {
            sequelize: connection,
            tableName: 'Users',
            freezeTableName: true,
            paranoid: true
        };
        User.init(fields, initOptions);
    }
}
