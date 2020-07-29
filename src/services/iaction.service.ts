import { Action } from "../auth/actions/action";
import { IAction } from "../auth/actions/action";

export interface IActionService {
    count(): Promise<number>,
    list(start: number, length: number): Promise<IAction[]>;
    findById(id: number): Promise<IAction>,
    deleteById(id: number): Promise<number>,
    updateAction(action: Action): Promise<IAction>,
    create(action: Action): Promise<IAction>,
    findBy(name: string): Promise<IAction>;

    findWithMethodNames(methodNames: string[], serviceName: string): Promise<IAction[]>;
}
