import { IRole, IDBRole } from "../auth/roles/role";

export interface IRoleService {
    count(includeDeleted?: boolean): Promise<number>;
    list(start: number, length: number, includeDeleted?: boolean): Promise<IDBRole[]>;
    findById(id: number, includeDeleted?: boolean): Promise<IDBRole | null>;
    deleteById(id: number): Promise<number>;
    updateRole(role: IRole): Promise<IDBRole>;
    create(role: IRole): Promise<IDBRole>;
    findBy(name: string, includeDeleted?: boolean): Promise<IDBRole>;

    findByIdIncludeUsers(id: number, includeDeleted?: boolean): Promise<IDBRole | null>;
    listIncludeUsers(start: number, length: number, includeDeleted?: boolean): IRole[] | PromiseLike<IRole[]>;
}
