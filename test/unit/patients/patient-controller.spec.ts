import { PatientController } from "../../../src/patients/patient.controller";
import { RouteTests } from "../route.tests";
import { StubPatientService } from "../services-stub/patient-stub.service";
import { StubUserService } from "../services-stub/user-stub.service";
import { StubPermissionService } from "../services-stub/permission-stub.service";
import { FunctionUtils } from "../function-utilities";

import sinon from "sinon";

beforeEach(() => {
    sinon.restore();
});

describe('Patient controller api methods', () => {
    const patientService = new StubPatientService();
    const userService = new StubUserService();
    const permissionService = new StubPermissionService();
    const patientController = new PatientController(
        patientService, userService, permissionService);

    describe('Get Patient by Id method', () => {
        it('should throw not found when invalid id', async () => {
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.findByIdIncludeUser))
                .resolves(null);

            try {
                await patientController.getById(1);

                (true).should.equal(false);
            } catch (error) {
                RouteTests.testError(404, 'Patient not found', error);
            }
        });

        it('should return a valid patient', async () => {
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.findByIdIncludeUser))
                .resolves({ id: 1 });

            const result = await patientController.getById(1);

            result.id.should.equal(1);
        });
    });

    describe('Delete Patient by Id method', () => {
        it('should delete patient', async () => {
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.deleteById))
                .resolves();
            const validateStub = sinon.stub(
                patientController, 
                FunctionUtils.nameAsAny(patientController.validatePatientExists)
            ).resolves();
            const removePermissionsStub = sinon.stub(
                permissionService, 
                FunctionUtils.nameAsAny(permissionService.removeAllPermissions)
            ).resolves();

            await patientController.deleteById(1);

            validateStub.called.should.be.true();
            removePermissionsStub.called.should.be.true();
        });
    });

    describe('List Patients method', () => {
        it('should return a valid list of patients and count', async () => {
            const patient: any = {id: 2, userId: 3};
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.listIncludeUser))
                .resolves([patient, patient]);
            sinon .stub(patientService, FunctionUtils.nameAsAny(patientService.count))
                .resolves(2);

            const result = await patientController.listPatients();

            result.count.should.be.equal(2);
            result.result.should.have.length(2);
            result.result.forEach(patient => {
                patient.id.should.be.equal(2);
                patient.userId.should.be.equal(3);
            });
        });
    });

    describe('Post Patient method', () => {
        it('should return a patient when valid', async () => {
            const validateUserStub = FunctionUtils.stubMethod(patientController, patientController.validateUserExists)
                .resolves();
            const validateNameStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientWithSameName)
                .returns(null);
            const addPermissionsStub = sinon.stub(
                permissionService, 
                FunctionUtils.nameAsAny(permissionService.addPermissions)
            ).resolves();

            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.create))
                .returns({ id: 1 } as any);

            const input = { name: '', userId: 5 } as any;
            const result = await patientController.postPatient(input, input.userId);

            result.id.should.equal(1);
            input.userId.should.equal(5);

            validateUserStub.called.should.be.true();
            validateNameStub.called.should.be.true();
            addPermissionsStub.called.should.be.true();
        });
    });

    describe('Put Patient method', () => {
        it('should update patient values', async () => {
            const patient = {id: 1, userId: 4, name: 'riso', birthDay: new Date(1950, 12, 12), isRegularSchool: true, schoolName: 'teste'};
            const validatePatientStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientExists)
                .resolves(patient);
            const validateUserStub = FunctionUtils.stubMethod(patientController, patientController.validateUserExists)
                .resolves();
            const validateNameStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientWithSameName)
                .returns(null);
                
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.updatePatient))
                .returns(null);

            const newBirthDay = new Date(1951, 1, 1);
            const input = { password: 'teste', userId: 5, name: 'risos', birthDay: newBirthDay } as any;
            await patientController.putPatient(1, input as any);

            patient.name.should.equal('risos');
            patient.birthDay.should.equal(newBirthDay);
            patient.schoolName.should.equal('teste');

            validateUserStub.called.should.be.true();
            validateNameStub.called.should.be.true();
            validatePatientStub.called.should.be.true();
        });

        it('should update patient school values if is in regular school', async () => {
            const patient = {id: 1, userId: 4, name: 'riso', birthDay: new Date(1950, 12, 12), isRegularSchool: false} as any;
            const validatePatientStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientExists)
                .resolves(patient);
            const validateUserStub = FunctionUtils.stubMethod(patientController, patientController.validateUserExists)
                .resolves();
            const validateNameStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientWithSameName)
                .returns(null);
                
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.updatePatient))
                .returns(null);

            const input = { isRegularSchool: true, schoolName: 'teste' } as any;
            await patientController.putPatient(1, input as any);

            patient.isRegularSchool.should.be.true();
            patient.schoolName.should.equal('teste');

            validateUserStub.called.should.be.false();
            validateNameStub.called.should.be.false();
            validatePatientStub.called.should.be.true();
        });

        it('should not update patient values', async () => {
            const patient = {id: 1, userId: 4, name: 'risos', isRegularSchool: true, schoolName: 'teste'};
            const validatePatientStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientExists)
                .resolves(patient);
            const validateUserStub = FunctionUtils.stubMethod(patientController, patientController.validateUserExists)
                .resolves();
            const validateNameStub = FunctionUtils.stubMethod(patientController, patientController.validatePatientWithSameName)
                .returns(null);
                
            sinon.stub(patientService, FunctionUtils.nameAsAny(patientService.updatePatient))
                .returns(null);

            const input = { userId: 4, name: 'risos' } as any;
            await patientController.putPatient(1, input as any);

            patient.name.should.equal('risos');
            patient.userId.should.equal(4);
            patient.isRegularSchool.should.equal(true);
            patient.schoolName.should.equal('teste');

            validateUserStub.called.should.be.false();
            validateNameStub.called.should.be.false();
            validatePatientStub.called.should.be.true();
        });
    });
});