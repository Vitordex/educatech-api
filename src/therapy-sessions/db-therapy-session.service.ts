import { TherapySession, IDBTherapySession } from "./therapy-session";
import { ITherapySession } from "./therapy-session";
import { DatabaseContext } from "../database/database-context";
import { Op } from "sequelize";
import { ITherapySessionService } from "../services/itherapy-session.service";

export class DBTherapySessionService implements ITherapySessionService {
    private Model: typeof TherapySession;
    private userRelation;
    private patientRelation;

    constructor(dbContext: DatabaseContext) {
        this.Model = dbContext.TherapySession;
        this.userRelation = dbContext.TherapySession.associations.user;
        this.patientRelation = dbContext.TherapySession.associations.patient;
    }


    public findAll(ids: number[]): Promise<IDBTherapySession[]> {
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


    public async findById(therapySessionId: number) {
        const result = await this.Model.findByPk(therapySessionId);
        return result!;
    }


    public deleteById(id: number) {
        return this.Model.destroy({
            where: {
                id
            }
        });
    }


    public async updateTherapySession(therapySession: IDBTherapySession) {
        return therapySession.save();
    }


    public async create(therapySession: ITherapySession) {
        const newTherapySession = this.Model.create(therapySession);
        return newTherapySession;
    }

    public findByIdIncludeUser(id: number): Promise<IDBTherapySession | null> {
        const result = this.Model.findByPk(id, { include: [this.userRelation, this.patientRelation] });
        return result;
    }


    public listIncludeUser(start: number, length: number): ITherapySession[] | PromiseLike<ITherapySession[]> {
        return this.Model.findAll({ limit: length, offset: start, include: [this.userRelation, this.patientRelation] });
    }
}
