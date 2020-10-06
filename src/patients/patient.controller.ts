import BaseController, { API_STATUS } from "../base/base.controller";

import { IPatient, IDBPatient } from "./patient";
import { IUser } from "../auth/users/user";

import { IPatientService } from "../services/ipatient.service";
import { IUserService } from "../services/iuser.service";
import { IPermissionService } from "../authorization/ipermission.service";
import { IOperation } from "../authorization/IOperation";
import { ApiFunctions } from "../api_utilities/api-functions";

export class PatientController extends BaseController {
    constructor(private patientService: IPatientService,
        private userService: IUserService,
        private permissionService: IPermissionService
    ) {
        super();
    }

    public async getById(id: number): Promise<IPatient> {
        let patient;
        try {
            patient = await this.patientService.findById(id);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the patient by id', error);
        }

        if (!patient) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'Patient not found');

        return patient;
    }

    public async deleteById(id: number) {
        await this.validatePatientExists(id);

        try {
            await this.patientService.deleteById(id);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error deleting the patient', error);
        }

        await this.permissionService.removeAllPermissions(id);
    }

    public async postPatient(patientInput: IPatient, userId: number) {
        await this.validatePatientWithSameName(patientInput.name);
        await this.validateUserExists(userId);

        let patient!: IPatient;
        try {
            patientInput.userId = userId;
            patient = await this.patientService.create(patientInput as any);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error creating the patient', error);
        }

        const operations: IOperation[] = [{
            methodName: 'putPatient',
            serviceName: 'patients'
        }, {
            methodName: 'getById',
            serviceName: 'patients'
        }, {
            methodName: 'deleteById',
            serviceName: 'patients'
        }];
        await this.permissionService.addPermissions(userId, patient.id, operations);

        return { id: patient.id };
    }

    public async putPatient(id: number, patientInput: IPatient) {
        const patient = await this.validatePatientExists(id);

        if (this.isValidAndDiferentValue(patientInput.name, patient.name))
            await this.validatePatientWithSameName(patientInput.name);

        if (this.isValidAndDiferentValue(patientInput.userId, patient.userId))
            await this.validateUserExists(patientInput.userId);

        try {
            patient.name = this.putChangeValue(patient.name, patientInput.name);
            patient.birthDay = this.putChangeValue(patient.birthDay, patientInput.birthDay);
            patient.isActive = this.putChangeValue(patient.isActive, patientInput.isActive);
            patient.isRegularSchool = this.putChangeValue(patient.isRegularSchool, patientInput.isRegularSchool);

            if (patientInput.isRegularSchool === true)
                patient.schoolName = this.putChangeValue(patient.schoolName, patientInput.schoolName);
            else if (patientInput.isRegularSchool === false) patient.schoolName = '';

            await this.patientService.updatePatient(patient);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error updating the patient', error);
        }
    }

    public async listPatients(start: number = 0, length: number = 10) {
        let patients: IPatient[] = [];
        let count = 0;
        try {
            patients = await this.patientService.listIncludeUser(start, length);
            count = await this.patientService.count();
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error listing patients', error);
        }

        return { result: patients, count };
    }

    public async listPatientsForUser(userId: number, start: number = 0, length: number = 10) {
        let patients: IPatient[] = [];
        let count = 0;
        try {
            patients = await this.patientService.list(userId, start, length);
            count = await this.patientService.count(userId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error listing patients', error);
        }

        return { result: patients, count };
    }

    public async validatePatientExists(patientId: number) {
        let found!: IDBPatient;
        try {
            found = await this.patientService.findById(patientId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the patient', error);
        }

        if (!found) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'Patient not found');

        return found;
    }

    public async validatePatientWithSameName(name: string) {
        let found: IPatient | null = null;
        try {
            found = await this.patientService.findByName(name);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error verifying patient name', error);
        }

        if (!!found) ApiFunctions.throwError(API_STATUS.CONFLICT, 'Patient already exists');
    }

    public async validateUserExists(userId: number) {
        let user: IUser | null = null;
        try {
            user = await this.userService.findById(userId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the user', error);
        }

        if (!user) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'User sent does not exists');
    }
}
