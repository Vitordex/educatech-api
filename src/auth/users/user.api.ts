import { AuthenticationMiddleware } from "../../authentication/authentication.middleware";
import { InputValidation } from "../../input-validation/input-validation.middleware";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import BaseApi from "../../base/base.api";
import { AuthorizationMiddleware } from "../../authorization/authorization.middleware";

export class UserApi extends BaseApi {
    constructor(protected controller: UserController,
        private userSchema: UserSchema,
        private authMiddleware: AuthenticationMiddleware,
        private validationMiddleware: InputValidation,
        private authorizationMiddleware: AuthorizationMiddleware) {
        super('users', 'users');
    }

    public configureRoutes() {
        this.router.get(
            '/v1/',
            this.validationMiddleware.validate(this.userSchema.schemas.list),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('listUsers')),
            this.executionMiddleware(({ query: { start, length } }) => this.controller.listUsers(start, length))
        );

        this.router.post(
            '/v1/register',
            this.validationMiddleware.validate(this.userSchema.schemas.register),
            this.executionMiddleware(({ body: user }) => this.controller.register(user)),
        );

        this.router.post(
            '/v1/login',
            this.validationMiddleware.validate(this.userSchema.schemas.login),
            this.executionMiddleware(({ body: { email, password } }) => this.controller.login(email, password))
        );

        this.router.get(
            '/v1/:id',
            this.validationMiddleware.validate(this.userSchema.schemas.getById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('getById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.getById(id))
        );

        this.router.delete(
            '/v1/:id',
            this.validationMiddleware.validate(this.userSchema.schemas.deleteById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('deleteById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.deleteById(id)),
        );

        this.router.post(
            '/v1/',
            this.validationMiddleware.validate(this.userSchema.schemas.postUser),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('postUser')),
            this.executionMiddleware(({ body: user }) => this.controller.postUser(user)),
        );

        this.router.put(
            '/v1/:id',
            this.validationMiddleware.validate(this.userSchema.schemas.putUser),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('putUser')),
            this.executionMiddleware(({ body: userInput, params: { id } }) => this.controller.putUser(id, userInput))
        );
    }
}