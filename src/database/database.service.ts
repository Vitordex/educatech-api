import { Options, Sequelize } from "sequelize";

export interface IDatabaseService {
    configure(options: Options);
    connection: Sequelize;
}