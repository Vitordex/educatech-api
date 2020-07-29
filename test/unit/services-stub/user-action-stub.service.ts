import { IUserActionService } from "../../../src/services/iuser-action.service";

export class StubUserActionService implements IUserActionService {
    /* @ts-ignore */
    findUserActionByUserId(userId: number): Promise<import("../../../src/auth/user-actions/user-action").IUserAction[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findUserActionByUserIdIncludeAction(userId: number, serviceName?: string, methodName?: string): Promise<import("../../../src/auth/user-actions/user-action").IUserAction[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    addUserActions(userActions: import("../../../src/auth/user-actions/user-action").IUserAction[]): Promise<import("../../../src/auth/user-actions/user-action").IUserAction[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    removeAllByUserId(userId: number): Promise<number> {
        throw new Error("Method not implemented.");
    }

}