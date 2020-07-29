import { RoleController } from "../../../src/auth/roles/role.controller";
import { RouteTests } from "../route.tests";
import { StubRoleService } from "../services-stub/role-stub.service";
import { StubUserService } from "../services-stub/user-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";
import should from "should";

describe('Role controller utilities', () => {
    const userService = new StubUserService();
    const roleService = new StubRoleService;
    const roleController = new RoleController(roleService, userService);

    describe('validateRoleExists method', () => {
        it('should throw not found when role unnexisting role in db', async () => {
            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.findByIdIncludeUsers))
                .resolves(null);

            try {
                await roleController.validateRoleExists(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'Role not found', error);
            }
        });

        it('should return a valid role', async () => {
            const emptyArray = [];
            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.findByIdIncludeUsers))
                .resolves({ id: 1, users: emptyArray });

            const role = await roleController.validateRoleExists(1);

            role.id.should.equal(1);
            should.equal(role.users, emptyArray);
        });
    });

    describe('validateRoleWithSameName method', () => {
        it('should throw conflict when role found with same name', async () => {
            sinon.stub(roleService, FunctionUtils.nameAsAny(roleService.findBy))
                .resolves({});

            try {
                await roleController.validateRoleWithSameName('teste');

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(409, 'Role already exists', error);
            }
        });
    })
});
