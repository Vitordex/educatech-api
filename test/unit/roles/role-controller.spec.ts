import { RoleController } from "../../../src/auth/roles/role.controller";
import { RouteTests } from "../route.tests";
import { StubRoleService } from "../services-stub/role-stub.service";
import { StubUserService } from "../services-stub/user-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";

beforeEach(() => {
    sinon.restore();
});

describe('Role controller utilities', () => {
    const userService = new StubUserService();
    const roleService = new StubRoleService;
    const roleController = new RoleController(roleService, userService);

    describe('Get Role by Id method', () => {
        it('should return a valid role', async () => {
            FunctionUtils.stubMethod(roleController, roleController.validateRoleExists)
                .resolves({ id: 1, users: [{ id: 2 }] });

            const result = await roleController.getById(1);

            result.id.should.equal(1);
            (result.users || [])[0].id.should.equal(2);
        });
    });

    describe('Delete Role by Id method', () => {
        it('should throw a Forbidden error if role has any user', async () => {
            const validateStub = sinon.stub(
                roleController,
                FunctionUtils.nameAsAny(roleController.validateRoleExists)
            ).resolves({
                id: 1,
                users: [{ id: 2 }]
            });

            try {
                await roleController.deleteById(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(403, 'Role contains users in it', error);

                validateStub.called.should.be.true();
            }
        });

        it('should delete user', async () => {
            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.deleteById))
                .resolves();
            const validateStub = sinon.stub(
                roleController,
                FunctionUtils.nameAsAny(roleController.validateRoleExists)
            ).resolves({ id: 1, users: [] });

            await roleController.deleteById(1);

            validateStub.called.should.be.true();
        });
    });

    describe('List Roles method', () => {
        it('should return a valid list of roles and count', async () => {
            const role: any = { id: 2, users: [{ id: 1 }] };
            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.listIncludeUsers))
                .resolves([role, role]);
            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.count))
                .resolves(2);

            const result = await roleController.listRoles();

            result.count.should.be.equal(2);
            result.result.should.have.length(2);
            result.result.forEach(role => {
                role.id.should.be.equal(2);
                (role.users || [])[0].id.should.be.equal(1);
            });
        });
    });

    describe('Post Role method', () => {
        it('should return a role when valid', async () => {
            const validateEmailStub = FunctionUtils.stubMethod(roleController, roleController.validateRoleWithSameName)
                .returns(null);

            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.create))
                .returns({ id: 1 } as any);

            const input = { name: 'alo' } as any;
            const result = await roleController.postRole(input as any);

            result.id.should.equal(1);

            validateEmailStub.called.should.be.true();
        });
    });

    describe('Put Role method', () => {
        it('should update role values', async () => {
            const role = {
                id: 1,
                name: 'teste',
                users: [],
                setUsers: () => { }
            };
            const validateRoleStub = FunctionUtils.stubMethod(roleController, roleController.validateRoleExists)
                .resolves(role);
            FunctionUtils.stubMethod(userService, userService.findAll)
                .resolves([{ id: 1 }, { id: 1 }, { id: 1 }]);
            const validateNameStub = FunctionUtils.stubMethod(roleController, roleController.validateRoleWithSameName)
                .resolves(null);

            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.updateRole))
                .resolves(null);
            FunctionUtils.stubMethod(role, role.setUsers)
                .callsFake((users) => {
                    role.users = users;
                });

            const input = { users: [{ id: 1 }, { id: 1 }, { id: 1 }], name: 'risos' } as any;
            await roleController.putRole(1, input as any);

            role.name.should.equal('risos');
            role.users.should.have.length(3);

            validateRoleStub.called.should.be.true();
            validateNameStub.called.should.be.true();
        });

        it('should not update role values', async () => {
            const role = {
                id: 1,
                name: 'teste',
                users: [],
                setUsers: () => { }
            };
            const validateRoleStub = FunctionUtils.stubMethod(roleController, roleController.validateRoleExists)
                .resolves(role);
            const listUsersStub = FunctionUtils.stubMethod(userService, userService.findAll)
                .resolves([{ id: 1 }, { id: 1 }, { id: 1 }]);
            const validateNameStub = FunctionUtils.stubMethod(roleController, roleController.validateRoleWithSameName)
                .resolves(null);

            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.updateRole))
                .resolves(null);
            FunctionUtils.stubMethod(role, role.setUsers)
                .callsFake((users) => {
                    role.users = users;
                });

            const input = {
                name: 'teste',
                users: []
            } as any;
            await roleController.putRole(1, input as any);

            role.name.should.equal('teste');
            role.users.should.have.length(0);

            validateRoleStub.called.should.be.true();
            validateNameStub.called.should.be.false();
            listUsersStub.called.should.be.false();
        });
    });
});