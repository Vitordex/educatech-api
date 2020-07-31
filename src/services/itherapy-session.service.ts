import { IDBTherapySession } from "../therapy-sessions/therapy-session";
import { ITherapySession } from "../therapy-sessions/therapy-session";

export interface ITherapySessionService {
    count(userId?: number): Promise<number>;
    list(userId: number, start: number, length: number): Promise<IDBTherapySession[]>;
    findById(therapySessionId: number): Promise<IDBTherapySession>;
    deleteById(id: number): Promise<number>;
    updateTherapySession(therapySession: IDBTherapySession): Promise<IDBTherapySession>;
    create(therapySession: ITherapySession): Promise<IDBTherapySession>;

    findByIdIncludeUser(id: number): Promise<IDBTherapySession | null>;
    listIncludeUser(start: number, length: number): ITherapySession[] | PromiseLike<ITherapySession[]>;

    findAll(ids: number[]): Promise<IDBTherapySession[]>;
}
