import {IPatientService} from '../../../src/services/ipatient.service'
import { IDBPatient, IPatient } from '../../../src/patients/patient';
export class StubPatientService implements IPatientService {
    /* @ts-ignore */
    count(userId?: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    list(userId: number, start: number, length: number): Promise<import("../../../src/patients/patient").IDBPatient[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findById(patientId: number): Promise<import("../../../src/patients/patient").IDBPatient> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    deleteById(id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    updatePatient(patient: IDBPatient): Promise<import("../../../src/patients/patient").IDBPatient> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    create(patient: IPatient): Promise<import("../../../src/patients/patient").IDBPatient> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByName(name: string): Promise<import("../../../src/patients/patient").IDBPatient> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByIdIncludeUser(id: number): Promise<import("../../../src/patients/patient").IDBPatient> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    listIncludeUser(start: number, length: number): import("../../../src/patients/patient").IPatient[] | PromiseLike<import("../../../src/patients/patient").IPatient[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findAll(ids: number[]): Promise<import("../../../src/patients/patient").IDBPatient[]> {
        throw new Error("Method not implemented.");
    }

}