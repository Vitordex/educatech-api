import { TherapySessionController } from "../../../src/therapy-sessions/therapy-session.controller";
import { RouteTests } from "../route.tests";
import { StubTherapySessionService } from "../services-stub/therapy-session-stub.service";
import { StubUserService } from "../services-stub/user-stub.service";
import { StubPermissionService } from "../services-stub/permission-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";
import { StubPatientService } from "../services-stub/patient-stub.service";

beforeEach(() => {
    sinon.restore();
});

describe('TherapySession controller api methods', () => {
    const therapySessionService = new StubTherapySessionService();
    const userService = new StubUserService();
    const patientService = new StubPatientService();
    const permissionService = new StubPermissionService();
    const therapySessionController = new TherapySessionController(
        therapySessionService, userService, patientService, permissionService);

    describe('Get TherapySession by Id method', () => {
        it('should throw not found when invalid id', async () => {
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.findByIdIncludeUser))
                .resolves(null);

            try {
                await therapySessionController.getById(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'Therapy Session not found', error);
            }
        });

        it('should return a valid therapySession', async () => {
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.findByIdIncludeUser))
                .resolves({ id: 1 });

            const result = await therapySessionController.getById(1);

            result.id.should.equal(1);
        });
    });

    describe('Delete TherapySession by Id method', () => {
        it('should delete therapySession', async () => {
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.deleteById))
                .resolves();
            const validateStub = sinon.stub(
                therapySessionController, 
                FunctionUtils.nameAsAny(therapySessionController.validateTherapySessionExists)
            ).resolves();
            const removePermissionsStub = sinon.stub(
                permissionService, 
                FunctionUtils.nameAsAny(permissionService.removeAllPermissions)
            ).resolves();

            await therapySessionController.deleteById(1);

            validateStub.called.should.be.true();
            removePermissionsStub.called.should.be.true();
        });
    });

    describe('List TherapySessions method', () => {
        it('should return a valid list of therapySessions and count', async () => {
            const therapySession: any = {id: 2, userId: 3};
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.listIncludeUser))
                .resolves([therapySession, therapySession]);
            sinon .stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.count))
                .resolves(2);

            const result = await therapySessionController.listTherapySessions();

            result.count.should.be.equal(2);
            result.result.should.have.length(2);
            result.result.forEach(therapySession => {
                therapySession.id.should.be.equal(2);
                therapySession.userId.should.be.equal(3);
            });
        });
    });

    describe('Post TherapySession method', () => {
        it('should return a therapySession when valid', async () => {
            const validateUserStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validateUserExists)
                .resolves();
            const validatePatientStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validatePatientExists)
                .resolves();
            const addPermissionsStub = sinon.stub(
                permissionService, 
                FunctionUtils.nameAsAny(permissionService.addPermissions)
            ).resolves();

            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.create))
                .returns({ id: 1 } as any);

            const input = { userId: 5, patientId: 1 } as any;
            const result = await therapySessionController.postTherapySession(input, input.userId);

            result.id.should.equal(1);

            validateUserStub.called.should.be.true();
            validatePatientStub.called.should.be.true();
            addPermissionsStub.called.should.be.true();
        });
    });

    describe('Put TherapySession method', () => {
        it('should update therapySession values', async () => {
            const therapySession = {id: 1, parentsRecommendation: 'bebe muita aua meu filho', sessionSummary: 'deu tudo errado', userId: 1, patientId: 2};
            const validateTherapySessionStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validateTherapySessionExists)
                .resolves(therapySession);
            const validateUserStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validateUserExists)
                .resolves();
            const validatePatientStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validatePatientExists)
                .resolves();
                
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.updateTherapySession))
                .returns(null);

            const input = {id: 1, parentsRecommendation: 'bebe muita agua meu filho', sessionSummary: 'deu tudo certo', userId: 2, patientId: 3} as any;
            await therapySessionController.putTherapySession(1, input as any);

            therapySession.userId.should.equal(2);
            therapySession.patientId.should.equal(3);
            therapySession.parentsRecommendation.should.equal(input.parentsRecommendation);
            therapySession.sessionSummary.should.equal(input.sessionSummary);

            validateUserStub.called.should.be.true();
            validatePatientStub.called.should.be.true();
            validateTherapySessionStub.called.should.be.true();
        });

        it('should not update therapySession values', async () => {
            const therapySession = {id: 1, parentsRecommendation: 'bebe muita aua meu filho', sessionSummary: 'deu tudo errado', userId: 1, patientId: 2};
            const validateTherapySessionStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validateTherapySessionExists)
                .resolves(therapySession);
            const validateUserStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validateUserExists)
                .resolves();
            const validatePatientStub = FunctionUtils.stubMethod(therapySessionController, therapySessionController.validatePatientExists)
                .resolves();
                
            sinon.stub(therapySessionService, FunctionUtils.nameAsAny(therapySessionService.updateTherapySession))
                .returns(null);

            const input = {id: 1, parentsRecommendation: 'bebe muita aua meu filho', sessionSummary: 'deu tudo errado', userId: 1, patientId: 2} as any;
            await therapySessionController.putTherapySession(1, input as any);

            therapySession.userId.should.equal(1);
            therapySession.patientId.should.equal(2);
            therapySession.parentsRecommendation.should.equal(input.parentsRecommendation);
            therapySession.sessionSummary.should.equal(input.sessionSummary);

            validateUserStub.called.should.be.false();
            validatePatientStub.called.should.be.false();
            validateTherapySessionStub.called.should.be.true();
        });
    });
});