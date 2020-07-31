import { PatientController } from "../../../src/patients/patient.controller";
import { RouteTests } from "../route.tests";
import { StubPatientService } from "../services-stub/patient-stub.service";
import { StubUserService } from "../services-stub/user-stub.service";
import { StubPermissionService } from "../services-stub/permission-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";

describe('Patient controller utilities', () => {
    const patientService = new StubPatientService();
    const userService = new StubUserService();
    const permissionService = new StubPermissionService();
    const patientController = new PatientController(
        patientService, userService, permissionService);

    it('should throw not found when role wasn\'t found on db', async () => {
        sinon.stub(userService, FunctionUtils.nameAsAny(userService.findById))
            .resolves(null);

        try {
            await patientController.validateUserExists(1);

            (true).should.equal(false);
        } catch (error) {
            RouteTests.testError(404, 'User sent does not exists', error);
        }
    });

    it('should throw conflict when patient found with same e-mail', async () => {
        sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.findByName))
            .resolves({});

        try {
            await patientController.validatePatientWithSameName('test@email.com');

            (true).should.equal(false);
        } catch (error) {
            RouteTests.testError(409, 'Patient already exists', error);
        }
    });

    describe('validatePatientExists method', () => {
        it('should throw not found when patient unnexisting patient in db', async () => {
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.findById))
                .resolves(null);

            try {
                await patientController.validatePatientExists(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'Patient not found', error);
            }
        });

        it('should return a valid patient', async () => {
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.findById))
                .resolves({ id: 1, userId: 0 });

            const patient = await patientController.validatePatientExists(1);

            patient.id.should.equal(1);
            patient.userId.should.equal(0);
        });
    });
});
