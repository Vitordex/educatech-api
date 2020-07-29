import { IUserAction } from "../auth/user-actions/user-action";

export interface IUserActionService {
    findUserActionByUserId(userId: number): Promise<IUserAction[]>;
    findUserActionByUserIdIncludeAction(userId: number, serviceName?: string, methodName?: string): Promise<IUserAction[]>;

    addUserActions(userActions: IUserAction[]): Promise<IUserAction[]>;

    removeAllByUserId(userId: number): Promise<number>;
}
