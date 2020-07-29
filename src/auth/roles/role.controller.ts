import BaseController, { API_STATUS } from "../../base/base.controller";
import { IRoleService } from "../../services/irole.service";
import { IRole, IDBRole } from "./role";
import { IUserService } from "../../services/iuser.service";
import { IUser } from "../users/user";

export class RoleController extends BaseController {
    constructor(
        private roleService: IRoleService,
        private userService: IUserService) {
        super();
    }

    public async getById(id: number): Promise<IRole> {
        const role = await this.validateRoleExists(id);
        return role;
    }

    public async deleteById(id: number) {
        const role = await this.validateRoleExists(id);

        if (role.users!.length > 0)
            this.throwError(API_STATUS.FORBIDDEN, 'Role contains users in it');

        try {
            await this.roleService.deleteById(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error deleting the role', error);
        }
    }

    public async postRole(roleInput: IRole) {
        await this.validateRoleWithSameName(roleInput.name);

        let role!: IRole;
        try {
            role = await this.roleService.create(roleInput);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error creating the role', error);
        }

        return { id: role.id };
    }

    public async putRole(id: number, roleInput: IRole) {
        const role = await this.validateRoleExists(id);

        let usersFound: IUser[] = [];
        if (roleInput.users && roleInput.users.length > 0) {
            try {
                const ids = roleInput.users!.map((user) => user.id);
                usersFound = await this.userService.findAll(ids);
            } catch (error) {
                this.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the users by id', error);
            }
        }

        if(this.isValidAndDiferentValue(roleInput.name, role.name))
            await this.validateRoleWithSameName(roleInput.name);

        try {
            usersFound = usersFound.filter((user) => !!user);
            await role.setUsers(usersFound.concat(role.users || []));
            role.name = this.putChangeValue(role.name, roleInput.name);
            await this.roleService.updateRole(role as any);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error updating the role', error);
        }
    }

    public async listRoles(start: number = 0, length: number = 10, includeDeleted = false) {
        let roles: IRole[] = [];
        let count = 0;
        try {
            roles = await this.roleService.listIncludeUsers(start, length, includeDeleted);
            count = await this.roleService.count(includeDeleted);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error listing roles', error);
        }

        return { result: roles, count };
    }

    public async validateRoleExists(roleId: number): Promise<IDBRole> {
        let role: IDBRole | null = null;
        try {
            role = await this.roleService.findByIdIncludeUsers(roleId);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the role by id', error);
        }

        if (!role) this.throwError(API_STATUS.NOT_FOUND, 'Role not found');

        return role!;
    }

    public async validateRoleWithSameName(name: string) {
        let found!: IRole;
        try {
            found = await this.roleService.findBy(name);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error verifying role email', error);
        }

        if (!!found) this.throwError(API_STATUS.CONFLICT, 'Role already exists');
    }
}