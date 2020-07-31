import { IPermissionService } from "../../../src/authorization/ipermission.service";

export class StubPermissionService implements IPermissionService {
    /* @ts-ignore */
    removeAllPermissions(userId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    addPermissions(userId: number, resourceId: number, operations: import("../../../src/authorization/IOperation").IOperation[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

}