import BaseController, { API_STATUS } from "../../base/base.controller";
import { IPutActionInput, IRegisterInput } from "./action.resources";
import { IActionService } from "../../services/iaction.service";
import { IAction } from "./action";

export class ActionController extends BaseController {
    constructor(private actionService: IActionService) {
        super();
    }

    public async getById(id: number): Promise<IAction> {
        let action!: IAction;
        try {
            action = await this.actionService.findById(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the action by id', error);
        }

        if (!action) this.throwError(API_STATUS.NOT_FOUND, 'Action not found');

        return action;
    }

    public async deleteById(id: any) {
        let found!: IAction;
        try {
            found = await this.actionService.findById(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error finding the action', error);
        }

        if (!found) this.throwError(API_STATUS.NOT_FOUND, 'Action not found');

        try {
            await this.actionService.deleteById(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error deleting the action', error);
        }
    }

    public async postAction(actionInput: IRegisterInput) {
        const { email } = actionInput;

        let found!: IAction;
        try {
            found = await this.actionService.findBy(email);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error verifying action email', error);
        }

        if (!!found) this.throwError(API_STATUS.CONFLICT, 'Action already exists');

        let action!: IAction;
        try {
            action = await this.actionService.create(actionInput as any);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error creating the action', error);
        }

        return { id: action.id };
    }

    public async putAction(id: number, actionInput: IPutActionInput) {
        let action!: IAction;
        try {
            action = await this.actionService.findById(id);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error getting the action by id', error);
        }

        if (!action) this.throwError(API_STATUS.NOT_FOUND, 'Action not found');

        try {
            action.methodName = this.putChangeValue(action.methodName, actionInput.name)!;
            await this.actionService.updateAction(action as any);
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error updating the action', error);
        }
    }

    public async listActions(start: number = 0, length: number = 10) {
        if (typeof start !== 'number') start = parseInt(start);
        if (typeof length !== 'number') length = parseInt(length);

        let actions: Array<IAction> = [];
        let count = 0;
        try {
            actions = await this.actionService.list(start, length);
            count = await this.actionService.count();
        } catch (error) {
            this.throwError(API_STATUS.INTERNAL_ERROR, 'Error listing actions', error);
        }

        return { result: actions, count };
    }
}