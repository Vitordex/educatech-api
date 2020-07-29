import { IDBUser } from "../auth/users/user";
import { IUser } from "../auth/users/user";

export interface IUserService {
    count(): Promise<number>;
    list(start: number, length: number): Promise<IDBUser[]>;
    findById(userId: number): Promise<IDBUser>;
    deleteById(id: number): Promise<number>;
    updateUser(user: IDBUser): Promise<IDBUser>;
    create(user: IUser): Promise<IDBUser>;
    findByEmail(email: string): Promise<IDBUser>;

    findByIdIncludeRole(id: number): Promise<IDBUser | null>;
    listIncludeRole(start: number, length: number): IUser[] | PromiseLike<IUser[]>;

    findAll(ids: number[]): Promise<IDBUser[]>;
}
