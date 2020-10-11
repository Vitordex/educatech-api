import { ITokenService } from "../../authentication/itoken.service";
import BaseController, { API_STATUS } from "../../base/base.controller";
import { IUserService } from "../../services/iuser.service";
import { IRoleService } from "../../services/irole.service";
import { IHashingService } from "../../services/ihashing.service";
import { IUser, IDBUser } from "./user";
import { IRole } from "../roles/role";
import { IPermissionService } from "../../authorization/ipermission.service";
import { IOperation } from "../../authorization/IOperation";

export class UserController extends BaseController {
    constructor(private userService: IUserService,
        private tokenService: ITokenService,
        private hashService: IHashingService,
        private roleService: IRoleService,
        private permissionService: IPermissionService
    ) {
        super();
    }

    public async register(userInput: IUser) {
        await this.validateUserWithSameEmail(userInput.email);

        let user!: IUser;
        try {
            userInput.roleId = 2;
            userInput.password = await this.hashService.createHash(userInput.password);
            user = await this.userService.create(userInput);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error creating the user', error);
        }

        const operations: IOperation[] = [{
            methodName: 'getById',
            serviceName: 'users'
        },{
            methodName: 'putUser',
            serviceName: 'users'
        },{
            methodName: 'deleteById',
            serviceName: 'users'
        },{
            methodName: 'listPatientsForUser',
            serviceName: 'patients'
        },{
            methodName: 'listTherapySessionsForUser',
            serviceName: 'therapy-sessions'
        }];
        await this.permissionService.addPermissions(user.id, user.id, operations);

        const token: string | object = await this.generateToken(user.id);
        return { token, user };
    }

    public async login(email: string, password: string) {
        let user!: IUser;
        try {
            user = await this.userService.findByEmail(email);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the user by email', error);
        }

        if (!user) this.throwError(API_STATUS.NOT_FOUND, 'User not found');

        const validPassword = await this.hashService.compare(password, user.password);
        if (!validPassword) this.throwError(API_STATUS.UNAUTHORIZED, 'Invalid password');

        const token: string | object = await this.generateToken(user.id);
        return { token, user };
    }

    public async getById(id: number): Promise<IUser> {
        let user;
        try {
            user = await this.userService.findByIdIncludeRole(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the user by id', error);
        }

        if (!user) this.throwError(API_STATUS.NOT_FOUND, 'User not found');

        return user;
    }

    public async deleteById(id: number) {
        await this.validateUserExists(id);

        try {
            await this.userService.deleteById(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error deleting the user', error);
        }

        await this.permissionService.removeAllPermissions(id);
    }

    public async postUser(userInput: IUser) {
        await this.validateUserWithSameEmail(userInput.email);
        await this.validateRoleExists(userInput.roleId);

        let user!: IUser;
        try {
            userInput.password = await this.hashService.createHash(userInput.password);
            user = await this.userService.create(userInput as any);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error creating the user', error);
        }

        const operations: IOperation[] = [{
            methodName: 'getById',
            serviceName: 'users'
        },{
            methodName: 'putUser',
            serviceName: 'users'
        },{
            methodName: 'deleteById',
            serviceName: 'users'
        },{
            methodName: 'listPatientsForUser',
            serviceName: 'patients'
        }];
        await this.permissionService.addPermissions(user.id, user.id, operations);

        return user;
    }

    public async putUser(id: number, userInput: IUser) {
        const user = await this.validateUserExists(id);

        if (this.isValidAndDiferentValue(userInput.email, user.email))
            await this.validateUserWithSameEmail(userInput.email);

        if (this.isValidAndDiferentValue(userInput.roleId, user.roleId)) 
            await this.validateRoleExists(userInput.roleId);

        try {
            user.email = this.putChangeValue(user.email, userInput.email);
            user.name = this.putChangeValue(user.name, userInput.name);
            user.birthDay = this.putChangeValue(user.birthDay, userInput.birthDay);
            user.gender = this.putChangeValue(user.gender, userInput.gender);

            if(!!userInput.password)
                userInput.password = await this.hashService.createHash(userInput.password);
            user.password = await this.putChangeValue(user.password, userInput.password);
            
            await this.userService.updateUser(user);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error updating the user', error);
        }

        return user;
    }

    public async listUsers(start: number = 0, length: number = 10) {
        let users: IUser[] = [];
        let count = 0;
        try {
            users = await this.userService.listIncludeRole(start, length);
            count = await this.userService.count();
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error listing users', error);
        }

        return { result: users, count };
    }

    public async generateToken(userId: number) {
        let token: string | object = '';
        try {
            token = await this.tokenService.generate({ id: userId });
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error generating the token', error);
        }

        return token;
    }

    public async validateUserExists(userId: number){
        let found!: IDBUser;
        try {
            found = await this.userService.findById(userId);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the user', error);
        }

        if (!found) this.throwError(API_STATUS.NOT_FOUND, 'User not found');

        return found;
    }

    public async validateUserWithSameEmail(email: string) {
        let found: IUser | null = null;
        try {
            found = await this.userService.findByEmail(email);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error verifying user email', error);
        }

        if (!!found) this.throwError(API_STATUS.CONFLICT, 'User already exists');
    }

    public async validateRoleExists(roleId: number) {
        let role: IRole | null = null;
        try {
            role = await this.roleService.findById(roleId);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the role', error);
        }

        if (!role) this.throwError(API_STATUS.NOT_FOUND, 'Role sent does not exists');
    }
}
