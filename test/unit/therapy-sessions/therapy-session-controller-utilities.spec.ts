import { TherapySessionController } from "../../../src/therapy-sessions/therapy-session.controller";
import { RouteTests } from "../route.tests";
import { StubTherapySessionService } from "../services-stub/therapy-session-stub.service";
import { StubUserService } from "../services-stub/user-stub.service";
import { StubPatientService } from "../services-stub/patient-stub.service";
import { StubPermissionService } from "../services-stub/permission-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";

describe('TherapySession controller utilities', () => {
    const therapySessionService = new StubTherapySessionService();
    const userService = new StubUserService();
    const patientService = new StubPatientService();
    const permissionService = new StubPermissionService();
    const therapySessionController = new TherapySessionController(
        therapySessionService, userService, patientService, permissionService);

    it('should throw not found when user wasn\'t found on db', async () => {
        sinon.stub(userService, FunctionUtils.nameAsAny(userService.findById))
            .resolves(null);

        try {
            await therapySessionController.validateUserExists(1);

            (true).should.equal(false);
        } catch (error) {
            RouteTests.testError(404, 'User sent does not exist', error);
        }
    });

    describe('validateTherapySessionExists method', () => {
        it('should throw not found when therapySession unnexisting therapySession in db', async () => {
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.findById))
                .resolves(null);

            try {
                await therapySessionController.validateTherapySessionExists(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'Therapy Session not found', error);
            }
        });

        it('should return a valid therapySession', async () => {
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.findById))
                .resolves({ id: 1, userId: 0 });

            const therapySession = await therapySessionController.validateTherapySessionExists(1);

            therapySession.id.should.equal(1);
            therapySession.userId.should.equal(0);
        });
    });
});
