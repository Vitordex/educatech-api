import BaseApi from "../../base/base.api";
import { InputValidation } from "../../input-validation/input-validation.middleware";
import { ActionController } from "./action.controller";
import { ActionSchema } from "./action.schema";
import { AuthenticationMiddleware } from "../../authentication/authentication.middleware";

export class ActionApi extends BaseApi {
    constructor(protected controller: ActionController,
        private actionSchema: ActionSchema,
        private authMiddleware: AuthenticationMiddleware,
        private validationMiddleware: InputValidation) {
        super('actions', 'actions');
    }

    configureRoutes() {
        this.router.get(
            '/:id',
            this.validationMiddleware.validate(this.actionSchema.schemas.getById),
            this.authMiddleware.authenticate(),
            this.executionMiddleware(({ params: { id } }) => this.controller.getById(id))
        );

        this.router.delete(
            '/:id',
            this.validationMiddleware.validate(this.actionSchema.schemas.deleteById),
            this.authMiddleware.authenticate(),
            this.executionMiddleware(({ params: { id } }) => this.controller.deleteById(id))
        );

        this.router.post(
            '/',
            this.validationMiddleware.validate(this.actionSchema.schemas.postAction),
            this.authMiddleware.authenticate(),
            this.executionMiddleware(({ body: action }) => this.controller.postAction(action))
        );

        this.router.put(
            '/:id',
            this.validationMiddleware.validate(this.actionSchema.schemas.putAction),
            this.authMiddleware.authenticate(),
            this.executionMiddleware(({ body: actionInput, params: { id } }) => this.controller.putAction(id, actionInput))
        );

        this.router.get(
            '/',
            this.validationMiddleware.validate(this.actionSchema.schemas.list),
            this.authMiddleware.authenticate(),
            this.executionMiddleware(({ query: { start, length } }) => this.controller.listActions(start, length))
        );
    }

}