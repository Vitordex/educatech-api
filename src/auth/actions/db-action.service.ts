import { Action, IAction } from "./action";
import { DatabaseContext } from "../../database/database-context";
import { IActionService } from "../../services/iaction.service";
import { Op } from "sequelize";

export class DBActionService implements IActionService {
    private Model: typeof Action;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.Action;
    }

    public findWithMethodNames(methodNames: string[], serviceName: string): Promise<IAction[]> {
        return this.Model.findAll({
            where: {
                methodName: {
                    [Op.in]: methodNames
                },
                serviceName: serviceName
            }
        });
    }


    public count() {
        return this.Model.count();
    }


    public list(start: number, length: number) {
        return this.Model.findAll({ limit: length, offset: start });
    }


    public async findById(id: number) {
        const result = await this.Model.findByPk(id);
        return result!;
    }


    public deleteById(id: number) {
        return this.Model.destroy({
            where: {
                id
            }
        });
    }


    public async updateAction(action: Action) {
        return action.save();
    }


    public async create(action: Action) {
        const newAction = new this.Model(action);
        await newAction.save();
        return newAction;
    }


    public async findBy(name: string) {
        const action = await this.Model.findOne({
            where: {
                methodName: name,
            },
            rejectOnEmpty: false
        });
        return action!;
    }
}
