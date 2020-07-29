import { IUserActionService } from "../../services/iuser-action.service";
import { DatabaseContext } from "../../database/database-context";
import { UserAction, IUserAction } from "./user-action";
import { Association } from "sequelize/types";
import { Action } from "../actions/action";

export class DBUserActionService implements IUserActionService {
    private Model: typeof UserAction;
    private actionAssociation: Association<UserAction, Action>;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.UserAction;
        this.actionAssociation = this.Model.associations.action;
    }

    public removeAllByUserId(userId: number): Promise<number> {
        return this.Model.destroy({ where: { userId: userId } });
    }

    public addUserActions(userActions: IUserAction[]): Promise<IUserAction[]> {
        return this.Model.bulkCreate(userActions);
    }

    public findUserActionByUserIdIncludeAction(userId: number, serviceName?: string, methodName?: string): Promise<IUserAction[]> {
        return this.Model.findAll({
            where: { userId },
            include: [{
                association: this.actionAssociation,
                where: {
                    serviceName,
                    methodName
                }
            }]
        });
    }

    public findUserActionByUserId(userId: number): Promise<IUserAction[]> {
        return this.Model.findAll({ where: { userId } });
    }
}
