import { IRoleAction } from "../auth/role-actions/role-action";

export interface IRoleActionService {
    findRoleActionsByRoleId(roleId: number): Promise<IRoleAction[]>;
    findRoleActionsByRoleIdIncludeAction(roleId: number, serviceName?: string, methodName?: string): Promise<IRoleAction[]>;
}
