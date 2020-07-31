import { IOperation } from "./IOperation";

export interface IPermissionService {
    removeAllPermissions(userId: number): Promise<void>;
    addPermissions(userId: number, resourceId: number, operations: IOperation[]): Promise<void>;
}