import { ITherapySessionService } from '../../../src/services/itherapy-session.service'
import { IDBTherapySession, ITherapySession } from '../../../src/therapy-sessions/therapy-session';
export class StubTherapySessionService implements ITherapySessionService {
    /* @ts-ignore */
    count(userId?: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    list(userId: number, start: number, length: number): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findById(therapySessionId: number): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    deleteById(id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    updateTherapySession(therapySession: IDBTherapySession): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    create(therapySession: ITherapySession): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByName(name: string): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByIdIncludeUser(id: number): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    listIncludeUser(start: number, length: number): import("../../../src/therapy-sessions/therapy-session").ITherapySession[] | PromiseLike<import("../../../src/therapy-sessions/therapy-session").ITherapySession[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findAll(ids: number[]): Promise<import("../../../src/therapy-sessions/therapy-session").IDBTherapySession[]> {
        throw new Error("Method not implemented.");
    }

}