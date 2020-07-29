import { Sequelize, Options, SyncOptions } from "sequelize";
import { IDatabaseService } from "./database.service";

export { Sequelize as Connection } from "sequelize";

export interface ConnectionOptions {
    username: string,
    password: string,
    database: string,
    host: string,
    port: number
}

export class MySQLDatabaseService implements IDatabaseService {
    public connection!: Sequelize;

    configure(options: Options) {
        this.connection = new Sequelize({ ...options, dialect: "mysql" });
    }

    sync(options: SyncOptions) {
        return this.connection.sync(options);
    }
}
