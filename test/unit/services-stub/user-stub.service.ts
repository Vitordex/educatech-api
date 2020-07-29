import { IUserService } from "../../../src/services/iuser.service";
import { IUser, IDBUser } from "../../../src/auth/users/user";

export class StubUserService implements IUserService {
    /* @ts-ignore */
    findAll(ids: number[]): Promise<IDBUser[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    list(start: number, length: number): Promise<import("../../../src/auth/users/user").IDBUser[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findById(userId: number): Promise<import("../../../src/auth/users/user").IDBUser> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    deleteById(id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    updateUser(user: IUser): Promise<import("../../../src/auth/users/user").IDBUser> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    create(user: IUser): Promise<import("../../../src/auth/users/user").IDBUser> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByEmail(email: string): Promise<import("../../../src/auth/users/user").IDBUser> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByIdIncludeRole(id: number): Promise<import("../../../src/auth/users/user").IDBUser> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    listIncludeRole(start: number, length: number): import("../../../src/auth/users/user").IDBUser[] | PromiseLike<import("../../../src/auth/users/user").IDBUser[]> {
        throw new Error("Method not implemented.");
    }
}