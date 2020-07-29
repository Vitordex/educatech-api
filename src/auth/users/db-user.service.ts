import { User, IDBUser } from "./user";
import { IUser } from "./user";
import { DatabaseContext } from "../../database/database-context";
import { Op } from "sequelize";
import { IUserService } from "../../services/iuser.service";

export class DBUserService implements IUserService {
    private Model: typeof User;
    private roleRelation;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.User;
        this.roleRelation = dbContext.User.associations.role;
    }


    public findAll(ids: number[]): Promise<IDBUser[]> {
        return this.Model.findAll({
            where: {
                id: { [Op.in]: ids }
            }
        });
    }


    public count() {
        return this.Model.count();
    }


    public list(start: number, length: number) {
        return this.Model.findAll({ limit: length, offset: start });
    }


    public async findById(userId: number) {
        const result = await this.Model.findByPk(userId);
        return result!;
    }


    public deleteById(id: number) {
        return this.Model.destroy({
            where: {
                id
            }
        });
    }


    public async updateUser(user: IDBUser) {
        return user.save();
    }


    public async create(user: IUser) {
        const newUser = this.Model.create(user);
        return newUser;
    }


    public async findByEmail(email: string) {
        const user = await this.Model.findOne({
            where: {
                email: email,
            },
            rejectOnEmpty: false
        });
        return user!;
    }


    public findByIdIncludeRole(id: number): Promise<IDBUser | null> {
        const result = this.Model.findByPk(id, { include: [this.roleRelation] });
        return result;
    }


    public listIncludeRole(start: number, length: number): IUser[] | PromiseLike<IUser[]> {
        return this.Model.findAll({ limit: length, offset: start, include: [this.roleRelation] });
    }
}
