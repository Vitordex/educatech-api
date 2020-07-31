import { UserController } from "../../../src/auth/users/user.controller";
import { HashingService } from "../../../src/auth/users/hashing.service";
import { RouteTests } from "../route.tests";
import { StubUserService } from "../services-stub/user-stub.service";
import { StubTokenService } from "../services-stub/token-stub.service";
import { StubRoleService } from "../services-stub/role-stub.service";
import { StubPermissionService } from '../services-stub/permission-stub.service';
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";

beforeEach(() => {
    sinon.restore();
});

describe('User controller api methods', () => {
    const userService = new StubUserService();
    const tokenService = new StubTokenService();
    const hashService = new HashingService(2);
    const roleService = new StubRoleService();
    const permissionService = new StubPermissionService();
    const userController = new UserController(
        userService,
        tokenService,
        hashService,
        roleService,
        permissionService);

    describe('Post Register method', () => {
        it('should return a user with a token when valid', async () => {
            const generatedToken: string = 'oaidnvida';
            sinon.stub(tokenService, FunctionUtils.nameAsAny(tokenService.generate))
                .returns(generatedToken);
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.create))
                .returns({ id: 1 } as any);
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByEmail))
                .returns(null);
            const addPermissionsStub = sinon.stub(
                permissionService,
                FunctionUtils.nameAsAny(permissionService.addPermissions)
            ).resolves();

            const input = { password: 'teste' } as any;
            const result = await userController.register(input as any);

            result.user.id.should.equal(1);
            result.token.should.equal(generatedToken);
            input.password.should.not.equal('teste');
            input.roleId.should.equal(2);

            addPermissionsStub.called.should.be.true();
        });
    });

    describe('Post Login method', () => {
        it('should throw not found when invalid e-mail', async () => {
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByEmail))
                .resolves(null);

            try {
                await userController.login('test.email', 'password');

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'User not found', error);
            }
        });

        it('should throw unauthorized when invalid password', async () => {
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByEmail))
                .resolves({ id: 1, password: await hashService.createHash('1234') });

            try {
                await userController.login('test.email', 'password');

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(401, 'Invalid password', error);
            }
        });

        it('should return a valid user and token', async () => {
            const validPassword = 'password';
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByEmail))
                .resolves({ id: 1, password: await hashService.createHash(validPassword) });
            const generatedToken: string = 'oaidnvida';
            sinon.stub(tokenService, FunctionUtils.nameAsAny(tokenService.generate))
                .returns(generatedToken);

            const result = await userController.login('test.email', validPassword);

            result.user.id.should.equal(1);
            result.token.should.equal(generatedToken);
        });
    });

    describe('Get User by Id method', () => {
        it('should throw not found when invalid id', async () => {
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByIdIncludeRole))
                .resolves(null);

            try {
                await userController.getById(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'User not found', error);
            }
        });

        it('should return a valid user', async () => {
            const validPassword = 'password';
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByIdIncludeRole))
                .resolves({ id: 1, password: await hashService.createHash(validPassword) });

            const result = await userController.getById(1);

            result.id.should.equal(1);
            result.password.should.not.be.empty();
        });
    });

    describe('Delete User by Id method', () => {
        it('should delete user', async () => {
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.deleteById))
                .resolves();
            const validateStub = sinon.stub(
                userController,
                FunctionUtils.nameAsAny(userController.validateUserExists)
            ).resolves();
            const removePermissionsStub = sinon.stub(
                permissionService,
                FunctionUtils.nameAsAny(permissionService.removeAllPermissions)
            ).resolves();

            await userController.deleteById(1);

            validateStub.called.should.be.true();
            removePermissionsStub.called.should.be.true();
        });
    });

    describe('List Users method', () => {
        it('should return a valid list of users and count', async () => {
            const user: any = { id: 2, roleId: 3 };
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.listIncludeRole))
                .resolves([user, user]);
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.count))
                .resolves(2);

            const result = await userController.listUsers();

            result.count.should.be.equal(2);
            result.result.should.have.length(2);
            result.result.forEach(user => {
                user.id.should.be.equal(2);
                user.roleId.should.be.equal(3);
            });
        });
    });

    describe('Post User method', () => {
        it('should return a user when valid', async () => {
            const validateRoleStub = FunctionUtils.stubMethod(userController, userController.validateRoleExists)
                .resolves();
            const validateEmailStub = FunctionUtils.stubMethod(userController, userController.validateUserWithSameEmail)
                .returns(null);
            const addPermissionsStub = sinon.stub(
                permissionService,
                FunctionUtils.nameAsAny(permissionService.addPermissions)
            ).resolves();

            sinon.stub(userService, FunctionUtils.nameAsAny(userService.create))
                .returns({ id: 1 } as any);

            const input = { password: 'teste', roleId: 5 } as any;
            const result = await userController.postUser(input as any);

            result.id.should.equal(1);
            input.password.should.not.equal('teste');
            input.roleId.should.equal(5);

            validateRoleStub.called.should.be.true();
            validateEmailStub.called.should.be.true();
            addPermissionsStub.called.should.be.true();
        });
    });

    describe('Put User method', () => {
        it('should update user values', async () => {
            const user = { id: 1, roleId: 4, password: '12345678', email: 'alodky', name: 'riso', gender: 0, birthDay: new Date(1950, 12, 12) };
            const validateUserStub = FunctionUtils.stubMethod(userController, userController.validateUserExists)
                .resolves(user);
            const validateRoleStub = FunctionUtils.stubMethod(userController, userController.validateRoleExists)
                .resolves();
            const validateEmailStub = FunctionUtils.stubMethod(userController, userController.validateUserWithSameEmail)
                .returns(null);

            sinon.stub(userService, FunctionUtils.nameAsAny(userService.updateUser))
                .returns(null);

            const newBirthDay = new Date(1951, 1, 1);
            const input = { password: 'teste', roleId: 5, email: 'alodki', name: 'risos', gender: 1, birthDay: newBirthDay } as any;
            await userController.putUser(1, input as any);

            input.password.should.not.equal('teste');
            user.name.should.equal('risos');
            user.email.should.equal('alodki');
            user.password.should.equal(input.password);
            user.gender.should.equal(1);
            user.birthDay.should.equal(newBirthDay);

            validateRoleStub.called.should.be.true();
            validateEmailStub.called.should.be.true();
            validateUserStub.called.should.be.true();
        });

        it('should not update user values', async () => {
            const user = { id: 1, roleId: 4, password: 'teste', email: 'alodki', name: 'risos' };
            const validateUserStub = FunctionUtils.stubMethod(userController, userController.validateUserExists)
                .resolves(user);
            const validateRoleStub = FunctionUtils.stubMethod(userController, userController.validateRoleExists)
                .resolves();
            const validateEmailStub = FunctionUtils.stubMethod(userController, userController.validateUserWithSameEmail)
                .returns(null);

            sinon.stub(userService, FunctionUtils.nameAsAny(userService.updateUser))
                .returns(null);

            const input = { password: 'teste', roleId: 4, email: 'alodki', name: 'risos' } as any;
            await userController.putUser(1, input as any);

            input.password.should.not.equal('teste');
            user.name.should.equal('risos');
            user.email.should.equal('alodki');
            user.roleId.should.equal(4);
            user.password.should.equal(input.password);

            validateRoleStub.called.should.be.false();
            validateEmailStub.called.should.be.false();
            validateUserStub.called.should.be.true();
        });
    });
});