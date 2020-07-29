import { Sequelize, Options } from "sequelize";
import { IDatabaseService } from "./database.service";

export { Sequelize as Connection } from "sequelize";

export class PgDatabaseService implements IDatabaseService {
    public connection!: Sequelize;

    public configure(options: Options) {
        this.connection = new Sequelize({ ...options, dialect: "postgres" });
        this.connection.sync({ force: true });
    }
}
