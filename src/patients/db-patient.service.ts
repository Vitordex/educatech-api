import { Patient, IDBPatient } from "./patient";
import { IPatient } from "./patient";
import { DatabaseContext } from "../database/database-context";
import { Op } from "sequelize";
import { IPatientService } from "../services/ipatient.service";

export class DBPatientService implements IPatientService {
    private Model: typeof Patient;
    private userRelation;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.Patient;
        this.userRelation = dbContext.Patient.associations.user;
    }


    public findAll(ids: number[]): Promise<IDBPatient[]> {
        return this.Model.findAll({
            where: {
                id: { [Op.in]: ids }
            }
        });
    }


    public count(userId?: number) {
        return this.Model.count(
            !!userId ? { where: { userId: userId } } : undefined);
    }


    public list(userId: number, start: number, length: number) {
        return this.Model.findAll({
            limit: length,
            offset: start,
            where: {
                userId: userId
            }
        });
    }


    public async findById(patientId: number) {
        const result = await this.Model.findByPk(patientId);
        return result!;
    }


    public deleteById(id: number) {
        return this.Model.destroy({
            where: {
                id
            }
        });
    }


    public async updatePatient(patient: IDBPatient) {
        return patient.save();
    }


    public async create(patient: IPatient) {
        const newPatient = this.Model.create(patient);
        return newPatient;
    }


    public async findByName(name: string) {
        const patient = await this.Model.findOne({
            where: {
                name: name,
            },
            rejectOnEmpty: false
        });
        return patient!;
    }


    public findByIdIncludeUser(id: number): Promise<IDBPatient | null> {
        const result = this.Model.findByPk(id, { include: [this.userRelation] });
        return result;
    }


    public listIncludeUser(start: number, length: number): IPatient[] | PromiseLike<IPatient[]> {
        return this.Model.findAll({ limit: length, offset: start, include: [this.userRelation] });
    }
}
