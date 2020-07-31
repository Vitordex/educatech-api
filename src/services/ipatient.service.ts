import { IDBPatient } from "../patients/patient";
import { IPatient } from "../patients/patient";

export interface IPatientService {
    count(userId?: number): Promise<number>;
    list(userId: number, start: number, length: number): Promise<IDBPatient[]>;
    findById(patientId: number): Promise<IDBPatient>;
    deleteById(id: number): Promise<number>;
    updatePatient(patient: IDBPatient): Promise<IDBPatient>;
    create(patient: IPatient): Promise<IDBPatient>;
    findByName(name: string): Promise<IDBPatient>;

    findByIdIncludeUser(id: number): Promise<IDBPatient | null>;
    listIncludeUser(start: number, length: number): IPatient[] | PromiseLike<IPatient[]>;

    findAll(ids: number[]): Promise<IDBPatient[]>;
}
