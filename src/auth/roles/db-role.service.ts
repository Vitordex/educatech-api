import { Role, IRole, IDBRole } from "./role";
import { DatabaseContext } from "../../database/database-context";
import { IRoleService } from "../../services/irole.service";

export class DBRoleService implements IRoleService {
    private Model: typeof Role;
    private userAssociation;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.Role;
        this.userAssociation = dbContext.Role.associations.users;
    }


    public listIncludeUsers(start: number, length: number, includeDeleted = false): Promise<IDBRole[]> {
        return this.Model.findAll({
            limit: length,
            offset: start,
            include: this.userAssociation,
            paranoid: !includeDeleted
        });
    }


    public count(includeDeleted = false): Promise<number> {
        return this.Model.count({ paranoid: !includeDeleted });
    }


    public list(start: number, length: number, includeDeleted = false): Promise<IDBRole[]> {
        return this.Model.findAll({
            limit: length, offset: start,
            paranoid: !includeDeleted
        });
    }


    public findById(id: number, includeDeleted = false): Promise<IDBRole | null> {
        const result = this.Model.findByPk(id, {
            paranoid: !includeDeleted
        });
        return result!;
    }


    public findByIdIncludeUsers(id: number, includeDeleted = false): Promise<IDBRole | null> {
        const result = this.Model.findByPk(id, {
            include: [this.userAssociation],
            paranoid: !includeDeleted
        });
        return result;
    }


    public deleteById(id: number): Promise<number> {
        return this.Model.destroy({
            where: {
                id
            }
        });
    }


    public async updateRole(role: IDBRole): Promise<IDBRole> {
        return role.save();
    }


    public async create(role: IRole): Promise<IDBRole> {
        const newRole = await this.Model.create(role);
        return newRole;
    }


    public async findBy(name: string, includeDeleted = false): Promise<IDBRole> {
        const role = await this.Model.findOne({
            where: {
                name: name,
            },
            rejectOnEmpty: false,
            paranoid: !includeDeleted
        });
        return role!;
    }
}
