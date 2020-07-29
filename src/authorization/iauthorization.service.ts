import { IOperation } from "./IOperation";
import { IUser } from "../auth/users/user";

export interface IAuthorizationService {
    authorize(user: IUser, resourceId: number, operationIdentifier: IOperation): Promise<boolean>;

    addPermissions(userId: number, serviceName: string, methodNames: string[]): Promise<void>;
    removePermissions(userId: number): Promise<number>;
}
