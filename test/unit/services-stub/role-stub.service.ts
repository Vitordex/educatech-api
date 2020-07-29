import { IRoleService } from "../../../src/services/irole.service";
import { IRole } from "../../../src/auth/roles/role";

export class StubRoleService implements IRoleService {
    /* @ts-ignore */
    count(includeDeleted?: boolean): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    list(start: number, length: number, includeDeleted?: boolean): Promise<import("../../../src/auth/roles/role").IDBRole[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findById(id: number, includeDeleted?: boolean): Promise<import("../../../src/auth/roles/role").IDBRole> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    deleteById(id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    updateRole(role: IRole): Promise<import("../../../src/auth/roles/role").IDBRole> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    create(role: IRole): Promise<import("../../../src/auth/roles/role").IDBRole> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findBy(name: string, includeDeleted?: boolean): Promise<import("../../../src/auth/roles/role").IDBRole> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findByIdIncludeUsers(id: number, includeDeleted?: boolean): Promise<import("../../../src/auth/roles/role").IDBRole> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    listIncludeUsers(start: number, length: number, includeDeleted?: boolean): IRole[] | PromiseLike<IRole[]> {
        throw new Error("Method not implemented.");
    }
    
}