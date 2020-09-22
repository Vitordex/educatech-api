import BaseController, { API_STATUS } from "../base/base.controller";

import { ITherapySession, IDBTherapySession } from "./therapy-session";
import { IUser } from "../auth/users/user";

import { ITherapySessionService } from "../services/itherapy-session.service";
import { IUserService } from "../services/iuser.service";
import { IPermissionService } from "../authorization/ipermission.service";
import { IOperation } from "../authorization/IOperation";
import { ApiFunctions } from "../api_utilities/api-functions";
import { IPatient } from "../patients/patient";
import { IPatientService } from "../services/ipatient.service";

export class TherapySessionController extends BaseController {
    constructor(private therapySessionService: ITherapySessionService,
        private userService: IUserService,
        private patientService: IPatientService,
        private permissionService: IPermissionService
    ) {
        super();
    }

    public async getById(id: number): Promise<ITherapySession> {
        let therapySession;
        try {
            therapySession = await this.therapySessionService.findById(id);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the therapy session by id', error);
        }

        if (!therapySession) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'Therapy Session not found');

        return therapySession;
    }

    public async deleteById(id: number) {
        await this.validateTherapySessionExists(id);

        try {
            await this.therapySessionService.deleteById(id);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error deleting the therapy session', error);
        }

        await this.permissionService.removeAllPermissions(id);
    }

    public async postTherapySession(therapySessionInput: ITherapySession, userId: number) {
        await this.validateUserExists(userId);
        await this.validatePatientExists(therapySessionInput.patientId);

        let therapySession!: ITherapySession;
        try {
            therapySessionInput.userId = userId;
            therapySession = await this.therapySessionService.create(therapySessionInput);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error creating the therapy session', error);
        }

        const operations: IOperation[] = [{
            methodName: 'getById',
            serviceName: 'therapy-sessions'
        }];
        await this.permissionService.addPermissions(userId, therapySession.id, operations);

        return { id: therapySession.id };
    }

    public async putTherapySession(id: number, therapySessionInput: ITherapySession) {
        const therapySession = await this.validateTherapySessionExists(id);

        if (this.isValidAndDiferentValue(therapySessionInput.userId, therapySession.userId))
            await this.validateUserExists(therapySessionInput.userId);

        if (this.isValidAndDiferentValue(therapySessionInput.patientId, therapySession.patientId))
            await this.validatePatientExists(therapySessionInput.patientId);

        try {
            therapySession.sessionSummary = this.putChangeValue(therapySession.sessionSummary, therapySessionInput.sessionSummary);
            therapySession.parentsRecommendation = this.putChangeValue(therapySession.parentsRecommendation, therapySessionInput.parentsRecommendation);
            therapySession.userId = this.putChangeValue(therapySession.userId, therapySessionInput.userId);
            therapySession.patientId = this.putChangeValue(therapySession.patientId, therapySessionInput.patientId);

            await this.therapySessionService.updateTherapySession(therapySession);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error updating the therapy session', error);
        }
    }

    public async listTherapySessions(start: number = 0, length: number = 10) {
        let therapySessions: ITherapySession[] = [];
        let count = 0;
        try {
            therapySessions = await this.therapySessionService.listIncludeUser(start, length);
            count = await this.therapySessionService.count();
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error listingtherapy sessions', error);
        }

        return { result: therapySessions, count };
    }

    public async listTherapySessionsForUser(userId: number, start: number = 0, length: number = 10) {
        let therapySessions: ITherapySession[] = [];
        let count = 0;
        try {
            therapySessions = await this.therapySessionService.list(userId, start, length);
            count = await this.therapySessionService.count(userId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error listing therapy sessions', error);
        }

        return { result: therapySessions, count };
    }

    public async validateTherapySessionExists(therapySessionId: number) {
        let found!: IDBTherapySession;
        try {
            found = await this.therapySessionService.findById(therapySessionId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the therapy session', error);
        }

        if (!found) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'Therapy Session not found');

        return found;
    }

    public async validateUserExists(userId: number) {
        let user: IUser | null = null;
        try {
            user = await this.userService.findById(userId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the user', error);
        }

        if (!user) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'User sent does not exist');
    }

    public async validatePatientExists(patientId: number) {
        let patient: IPatient | null = null;
        try {
            patient = await this.patientService.findById(patientId);
        } catch (error) {
            ApiFunctions.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the patient', error);
        }

        if (!patient) ApiFunctions.throwError(API_STATUS.NOT_FOUND, 'Patient sent does not exist');
    }
}
