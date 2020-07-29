import BaseApi from "../../base/base.api";
import { InputValidation } from "../../input-validation/input-validation.middleware";
import { RoleController } from "./role.controller";
import { RoleSchema } from "./role.schema";
import { AuthenticationMiddleware } from "../../authentication/authentication.middleware";
import { AuthorizationMiddleware } from "../../authorization/authorization.middleware";

export class RoleApi extends BaseApi {
    constructor(protected controller: RoleController,
        private roleSchema: RoleSchema,
        private authMiddleware: AuthenticationMiddleware,
        private authorizationMiddleware: AuthorizationMiddleware,
        private validationMiddleware: InputValidation) {
        super('roles', 'roles');
    }

    configureRoutes() {
        this.router.get(
            '/v1/:id',
            this.validationMiddleware.validate(this.roleSchema.schemas.getById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('getById')),
            this.executionMiddleware(
                ({ params: { id } }) => this.controller.getById(id)
            )
        );

        this.router.delete(
            '/v1/:id',
            this.validationMiddleware.validate(this.roleSchema.schemas.deleteById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('deleteById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.deleteById(id))
        );

        this.router.post(
            '/v1/',
            this.validationMiddleware.validate(this.roleSchema.schemas.postRole),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('postRole')),
            this.executionMiddleware(({ body: role }) => this.controller.postRole(role))
        );

        this.router.put(
            '/v1/:id',
            this.validationMiddleware.validate(this.roleSchema.schemas.putRole),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('putRole')),
            this.executionMiddleware(({ body: roleInput, params: { id } }) => this.controller.putRole(id, roleInput))
        );

        this.router.get(
            '/v1/',
            this.validationMiddleware.validate(this.roleSchema.schemas.list),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('listRoles')),
            this.executionMiddleware(({ 
                query: { 
                    start, 
                    length, 
                    includeDeleted 
                } 
            }) => this.controller.listRoles(start, length, includeDeleted))
        );
    }

}