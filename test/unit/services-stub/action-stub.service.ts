import { IActionService } from "../../../src/services/iaction.service";
import { Action } from "../../../src/auth/actions/action";

export class StubActionService implements IActionService {
    /* @ts-ignore */
    count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    list(start: number, length: number): Promise<import("../../../src/auth/actions/action").IAction[]> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findById(id: number): Promise<import("../../../src/auth/actions/action").IAction> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    deleteById(id: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    updateAction(action: Action): Promise<import("../../../src/auth/actions/action").IAction> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    create(action: Action): Promise<import("../../../src/auth/actions/action").IAction> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findBy(name: string): Promise<import("../../../src/auth/actions/action").IAction> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    findWithMethodNames(methodNames: string[], serviceName: string): Promise<import("../../../src/auth/actions/action").IAction[]> {
        throw new Error("Method not implemented.");
    }

}