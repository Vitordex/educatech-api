import { UserController } from "../../../src/auth/users/user.controller";
import { HashingService } from "../../../src/auth/users/hashing.service";
import { RouteTests } from "../route.tests";
import { StubUserService } from "../services-stub/user-stub.service";
import { StubTokenService } from "../services-stub/token-stub.service";
import { StubRoleService } from "../services-stub/role-stub.service";
import { StubActionService } from "../services-stub/action-stub.service";
import { StubUserActionService } from "../services-stub/user-action-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";

describe('User controller utilities', () => {
    const userService = new StubUserService();
    const tokenService = new StubTokenService();
    const hashService = new HashingService(2);
    const roleService = new StubRoleService();
    const userActionService = new StubUserActionService();
    const actionService = new StubActionService();
    const userController = new UserController(
        userService, 
        tokenService, 
        hashService, 
        roleService, 
        userActionService, 
        actionService);

    it('should throw not found when role wasn\'t found on db', async () => {
        sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.findById))
            .resolves(null);

        try {
            await userController.validateRoleExists(1);

            (true).should.equal(false);
        } catch (error) {
            RouteTests.testError(404, 'Role sent does not exists', error);
        }
    });

    it('should throw conflict when user found with same e-mail', async () => {
        sinon.stub(userService, FunctionUtils.nameAsAny(userService.findByEmail))
            .resolves({});

        try {
            await userController.validateUserWithSameEmail('test@email.com');

            (true).should.equal(false);
        } catch (error) {
            RouteTests.testError(409, 'User already exists', error);
        }
    });

    describe('validateUserExists method', () => {
        it('should throw not found when user unnexisting user in db', async () => {
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findById))
                .resolves(null);

            try {
                await userController.validateUserExists(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'User not found', error);
            }
        });

        it('should return a valid user', async () => {
            sinon.stub(userService, FunctionUtils.nameAsAny(userService.findById))
                .resolves({ id: 1, roleId: 0 });

            const user = await userController.validateUserExists(1);

            user.id.should.equal(1);
            user.roleId.should.equal(0);
        });
    });

    describe('generateToken method', () => {
        it('should throw internal error when error was thrown', async () => {
            sinon.stub(tokenService, FunctionUtils.nameAsAny(tokenService.generate))
                .rejects();

            try {
                await userController.generateToken(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(500, 'Error generating the token', error);
            }
        });

        it('should return a valid token', async () => {
            sinon.stub(tokenService, FunctionUtils.nameAsAny(tokenService.generate))
                .resolves('test-token');

            const token = await userController.generateToken(1);

            token.should.equal('test-token');
        });
    });

    describe('removePermissions method', () => {
        it('should throw internal error when error was thrown', async () => {
            sinon.stub(userActionService, FunctionUtils.nameAsAny(userActionService.removeAllByUserId))
                .rejects();

            try {
                await userController.removePermissions(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(500, 'Error erasing user permissions', error);
            }
        });
    });

    describe('addPermissions method', () => {
        it('should throw internal error when error was thrown', async () => {
            sinon.stub(actionService, FunctionUtils.nameAsAny(actionService.findWithMethodNames))
                .rejects();

            try {
                await userController.addPermissions([''], 1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(500, 'Error finding actions', error);
            }
        });

        it('should throw internal error when error was thrown', async () => {
            sinon.stub(actionService, FunctionUtils.nameAsAny(actionService.findWithMethodNames))
                .resolves([{id: 1}]);
            sinon.stub(userActionService, FunctionUtils.nameAsAny(userActionService.addUserActions))
                .rejects();

            try {
                await userController.addPermissions([''], 1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(500, 'Error adding user permissions', error);
            }
        });
    });
});
